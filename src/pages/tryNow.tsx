import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { IoClose } from 'react-icons/io5';
import { BiError } from 'react-icons/bi';
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '../components/global/SEO';
import clsx from 'clsx';
import CustomButton from '../components/global/CustomButton';
import useAppStore from '../store/useStore';
import ChannelList from '../components/pages/login/ChannelList';
import moment from 'moment';
import SimpleBackdrop from '../components/global/LoadingBackdrop';
import tclogo from '../assets/svg/tc-logo.svg';
import Image from 'next/image';
import { StorageService } from '../services/StorageService';
import { FaDiscord } from 'react-icons/fa';

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#804EE1',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#804EE1',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 6,
    border: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 1,
  },
}));

const VerticalColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#804EE1',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#804EE1',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    marginTop: '-8px',
    marginBottom: '-8px',
    marginLeft: '8px',
    minHeight: 'calc(24px + 1.5rem)',
    borderLeftWidth: '6px',
    borderColor: '#F5F5F5',
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: '#FFFFFF',
  zIndex: 1,
  color: '#222222',
  fontWeight: 'bold',
  width: 50,
  height: 50,
  fontSize: '27px',
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  ...(ownerState.active && {
    border: 'solid 4px #804EE1',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#804EE1',
    color: 'white',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: number } = {
    1: 1,
    2: 2,
    3: 3,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  <>
    <b>Connect</b> your Discord community
  </>,
  <>
    <b>Select</b> time period and channels you want to be analysed
  </>,
  <>
    <b>Begin</b> data import
  </>,
];

type dateItems = {
  title: string;
  icon?: JSX.Element;
  value: any;
};
const datePeriod: dateItems[] = [
  {
    title: 'Last 7 days',
    value: 1,
  },
  {
    title: '1M',
    value: 2,
  },
  {
    title: '3M',
    value: 3,
  },
  {
    title: '6M',
    value: 4,
  },
  {
    title: '1Y',
    value: 5,
  },
];

export default function TryNow() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [activeStep, setActiveStep] = useState(-1);
  const [activePeriod, setActivePeriod] = useState<number | string>(1);
  const [emailAddress, setEmailAddress] = useState('');
  const [isTermsChecked, setTermsCheck] = useState(false);
  const [guild, setGuild] = useState<any>('');
  const [selectedPeriod, setSelectedPeriod] = useState<any>('');
  const [channels, setChannels] = useState<Array<any>>([]);
  const [selectedChannels, setSelectedChannels] = useState<Array<any>>([]);
  const [tryNowState, setTryNowState] = useState<'active' | 'passive'>(
    'active'
  );
  const {
    isLoading,
    signUp,
    login,
    loginWithDiscord,
    fetchGuildChannels,
    guildChannels,
    changeEmail,
    updateGuildById,
  } = useAppStore();

  useEffect(() => {
    const channels = guildChannels.map((guild: any, index: any) => {
      const selected: Record<any, any> = {};
      guild.subChannels.forEach((subChannel: any) => {
        selected[subChannel.id] = true;
      });

      return { ...guild, selected: selected };
    });

    const subChannelsStatus = channels.map((channel: any) => {
      return channel.selected;
    });

    const selectedChannelsStatus = Object.assign({}, ...subChannelsStatus);
    let activeChannel: string[] = [];
    for (const key in selectedChannelsStatus) {
      if (selectedChannelsStatus[key]) {
        activeChannel.push(key);
      }
    }

    const result = [].concat(
      ...channels.map((channel: any) => {
        return channel.subChannels
          .filter((subChannel: any) => {
            if (activeChannel.includes(subChannel.id)) {
              return subChannel;
            }
          })
          .map((filterdItem: any) => {
            return { channelId: filterdItem.id, channelName: filterdItem.name };
          });
      })
    );
    setSelectedChannels(result);

    setChannels(channels);
  }, [guildChannels]);

  const onChange = (
    channelId: string,
    subChannelId: string,
    status: boolean
  ) => {
    setChannels((preChannels) => {
      return preChannels.map((preChannel) => {
        if (preChannel.id !== channelId) return preChannel;

        const selected = preChannel.selected;
        selected[subChannelId] = status;

        return { ...preChannel, selected };
      });
    });
  };
  const handleCheckAll = (guild: any, status: boolean) => {
    const selectedGuild: any = channels.filter(
      (channel: any) => channel.id === guild.id
    )[0].id;

    setChannels((preChannels) => {
      return preChannels.map((preChannel) => {
        if (selectedGuild === preChannel.id) {
          Object.keys(preChannel.selected).forEach((key: any) => {
            preChannel.selected[key] = status;
          });
        }
        return preChannel;
      });
    });
  };

  if (typeof window !== 'undefined') {
    useEffect(() => {
      if (Object.keys(router?.query).length > 0 && router.query.statusCode) {
        if (router.query.statusCode === '501') {
          fetchGuildChannels(router.query.guildId);
          setActiveStep(1);
          const {
            accessToken,
            accessExp,
            guildId,
            guildName,
            refreshExp,
            refreshToken,
          } = Object.assign({}, router.query);
          setGuild(guildId);
          loginWithDiscord({
            accessToken,
            accessExp,
            guildId,
            guildName,
            refreshExp,
            refreshToken,
          });
          setSelectedDatePeriod(1);
        } else {
          setTryNowState('passive');
        }
      }
    }, [router]);
  }
  const submitChannels = () => {
    const subChannelsStatus = channels.map((channel: any) => {
      return channel.selected;
    });

    const selectedChannelsStatus = Object.assign({}, ...subChannelsStatus);
    let activeChannel: string[] = [];
    for (const key in selectedChannelsStatus) {
      if (selectedChannelsStatus[key]) {
        activeChannel.push(key);
      }
    }

    const result = [].concat(
      ...channels.map((channel: any) => {
        return channel.subChannels
          .filter((subChannel: any) => {
            if (activeChannel.includes(subChannel.id)) {
              return subChannel;
            }
          })
          .map((filterdItem: any) => {
            return { channelId: filterdItem.id, channelName: filterdItem.name };
          });
      })
    );
    setSelectedChannels(result);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateGuild = () => {
    try {
      updateGuildById(guild, selectedPeriod, selectedChannels).then(
        (res: any) => {
          if (emailAddress && emailAddress != '') {
            changeEmail(emailAddress).then((_res: any) => {
              setActiveStep(2);
            });
          } else {
            setActiveStep(2);
          }
        }
      );
    } catch (error) {}
  };

  const redirectToSettings = () => {
    const user = router.query;
    StorageService.writeLocalStorage('user', {
      guild: {
        guildId: user.guildId,
        guildName: user.guildName,
      },
      token: {
        accessToken: user.accessToken,
        accessExp: user.accessExp,
        refreshToken: user.refreshToken,
        refreshExp: user.refreshExp,
      },
    });
    router.push('/settings');
  };

  const setSelectedDatePeriod = (dateRangeType: number | string) => {
    let dateTime = '';
    switch (dateRangeType) {
      case 1:
        setActivePeriod(dateRangeType);
        dateTime = moment()
          .subtract('7', 'days')
          .format('YYYY-MM-DDTHH:mm:ss[Z]');
        break;
      case 2:
        setActivePeriod(dateRangeType);
        dateTime = moment()
          .subtract('1', 'months')
          .format('YYYY-MM-DDTHH:mm:ss[Z]');
        break;
      case 3:
        setActivePeriod(dateRangeType);
        dateTime = moment()
          .subtract('3', 'months')
          .format('YYYY-MM-DDTHH:mm:ss[Z]');
        break;
      case 4:
        setActivePeriod(dateRangeType);
        dateTime = moment()
          .subtract('6', 'months')
          .format('YYYY-MM-DDTHH:mm:ss[Z]');
        break;
      case 5:
        setActivePeriod(dateRangeType);
        dateTime = moment()
          .subtract('1', 'year')
          .format('YYYY-MM-DDTHH:mm:ss[Z]');
        break;
      default:
        break;
    }
    setSelectedPeriod(dateTime);

    setActivePeriod(dateRangeType);
  };

  return (
    <>
      {isLoading ? (
        <SimpleBackdrop />
      ) : (
        <>
          <SEO titleTemplate="Connect your commiunity" />
          <div className="mx-auto flex justify-center mt-4 md:mt-8">
            <a href="https://togethercrew.com/">
              <Image alt="Image Alt" src={tclogo} />
            </a>
          </div>
          {tryNowState === 'active' ? (
            <div className="p-3 md:p-0">
              <div className="shadow-xl md:w-[650px] md:h-[570px] mx-auto rounded-xl overflow-hidden mt-4 mb-2 md:mt-6 md:mb-3">
                {activeStep === 0 || activeStep === -1 ? (
                  <>
                    <div className="bg-secondary text-white text-center py-8">
                      <h1 className="font-bold text-2xl">
                        Welcome to TogetherCrew
                      </h1>
                      <p className="text-base pt-3">
                        Let’s connect your community.
                      </p>
                    </div>
                  </>
                ) : (
                  ''
                )}
                <div className="py-12">
                  <div className="py-3 px-8 text-center mx-auto">
                    <Stepper
                      className={clsx(
                        'md:hidden',
                        activeStep === 0 || activeStep === -1 ? 'block' : 'flex'
                      )}
                      orientation={
                        activeStep === 0 || activeStep === -1
                          ? 'vertical'
                          : 'horizontal'
                      }
                      alternativeLabel={
                        activeStep === 0 || activeStep === -1 ? false : true
                      }
                      activeStep={activeStep}
                      connector={
                        activeStep === 0 || activeStep === -1 ? (
                          <VerticalColorlibConnector />
                        ) : (
                          <ColorlibConnector />
                        )
                      }
                    >
                      {steps.map((label, index) => (
                        <Step key={index}>
                          <StepLabel StepIconComponent={ColorlibStepIcon}>
                            {activeStep === 0 || activeStep === -1 ? label : ''}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <div>
                      <Stepper
                        className={clsx(
                          'hidden md:flex',
                          activeStep === 0 || activeStep === -1
                            ? 'w-full'
                            : 'w-2/3 mx-auto'
                        )}
                        alternativeLabel
                        activeStep={activeStep}
                        connector={<ColorlibConnector />}
                      >
                        {steps.map((label, index) => (
                          <Step key={index}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>
                              {activeStep === 0 || activeStep === -1
                                ? label
                                : ''}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </div>
                    {activeStep === 0 || activeStep === -1 ? (
                      <>
                        <FormControlLabel
                          className="pt-12 md:w-2/3 font-medium text-left items-start"
                          control={
                            <Checkbox
                              color="secondary"
                              value={isTermsChecked}
                              onChange={(e) => setTermsCheck(e.target.checked)}
                            />
                          }
                          label={
                            <span className="text-sm">
                              I understand and agree to the{' '}
                              <b className="text-secondary">
                                <a
                                  href="https://togethercrew.com/privacy"
                                  target="blank"
                                >
                                  Privacy Policy and Terms of Service.
                                </a>
                              </b>
                            </span>
                          }
                        />
                        <div className="flex justify-center mt-8">
                          <CustomButton
                            disabled={!isTermsChecked}
                            label="Connect your community"
                            onClick={() => signUp()}
                            classes={'bg-secondary text-white'}
                          />
                        </div>
                      </>
                    ) : activeStep === 1 ? (
                      <>
                        <div className="flex flex-col space-y-8 text-left mt-8 p-1 md:p-6">
                          <div>
                            <h3 className="font-bold text-base">
                              Choose date period for data analysis
                            </h3>
                            <p className="text-base">
                              You will be able to change date period and
                              selected channels in the future.
                            </p>
                            <div className="flex flex-row flex-wrap md:space-x-3 mt-2">
                              <ul className="flex flex-row flex-wrap space-x-1.5 md:space-x-3">
                                {datePeriod.length > 0
                                  ? datePeriod.map((el) => (
                                      <li
                                        className={`
                         flex flex-row items-center px-3 md:px-2.5 py-2 md:py-1.5 rounded-md cursor-pointer
                         ${
                           activePeriod == el.value
                             ? 'bg-black text-white'
                             : 'bg-gray-background'
                         }`}
                                        key={el.value}
                                        onClick={() =>
                                          setSelectedDatePeriod(el.value)
                                        }
                                      >
                                        {el.icon ? el.icon : ''}
                                        <div>{el.title}</div>
                                      </li>
                                    ))
                                  : ''}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-base pb-3">
                              Confirm your imported channels
                            </h3>
                            <p className="text-base">
                              Selected channels:
                              <b>{selectedChannels.length}</b>{' '}
                              <span
                                className="pl-4 text-secondary underline cursor-pointer font-bold"
                                onClick={() => {
                                  setOpen(true);
                                }}
                              >
                                Show Channels
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="font-bold pb-2">Type your email</p>
                            <TextField
                              id="filled-basic"
                              label="Email Address"
                              variant="filled"
                              autoComplete="off"
                              value={emailAddress}
                              InputProps={{ disableUnderline: true }}
                              className="w-full md:w-2/5"
                              onChange={(e) => setEmailAddress(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-center mt-4">
                            <CustomButton
                              classes="text-white bg-secondary"
                              onClick={() => updateGuild()}
                              label="Continue"
                              disabled={!activeStep}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full md:w-4/5 text-center mx-auto py-12 md:py-12">
                          <h3 className="font-bold text-3xl pt-7">
                            {"Perfect, you're all set!"}
                          </h3>
                          <p className="py-8 text-base">
                            Data import just started. It might take up to 12
                            hours to finish. Once it is done we will send you a{' '}
                            <b>message on Discord.</b>
                          </p>
                          <CustomButton
                            classes="text-white bg-secondary"
                            onClick={() => router.push('/')}
                            label="I Understand"
                            disabled={!activeStep}
                          />
                        </div>
                        <p className="text-left md:text-center">
                          While you are waiting, read our research about{' '}
                          <b className="text-secondary">
                            {' '}
                            <Link
                              href={
                                'https://rndao.mirror.xyz/F-SMj6p_jdYvrMMkR1d9Hd6YbEg39qItTKfjo-zkgqM'
                              }
                            >
                              Community Health.
                            </Link>
                          </b>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white flex flex-row justify-center p-4 shadow-xl items-center text-center md:w-[650px] mx-auto rounded-xl overflow-hidden">
                <FaDiscord size={30} className="mr-1" />
                Already connected?{' '}
                <span
                  onClick={login}
                  className="text-secondary font-bold pl-1 cursor-pointer"
                >
                  Log in
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 md:p-0">
              <div className="shadow-xl md:w-[650px] mx-auto rounded-xl overflow-hidden mt-4 md:my-14">
                <div className="p-8 text-center mx-auto flex flex-col space-y-7 py-12">
                  <div className="mx-auto">
                    <BiError size={48} className="text-error-500" />
                  </div>
                  <p className="text-xl font-bold">
                    Please, disconnect your <br className="hidden md:block" />{' '}
                    community first
                  </p>
                  <span className="text-sm w-10/12 text-center mx-auto">
                    There is one Discord community under your email already. If
                    you want to add a new community, please disconnect the
                    current community first. Go to the <b>Settings</b> section
                    and choose <b>Disconnect</b> option.
                  </span>
                  <CustomButton
                    classes="bg-secondary text-white mx-auto mt-4"
                    label={'Log in'}
                    onClick={() => {
                      redirectToSettings();
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <Dialog
            fullWidth={fullWidth}
            open={open}
            sx={{
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '650px',
                  borderRadius: '10px',
                },
              },
            }}
            onClose={handleClose}
          >
            <div className="p-4">
              <div>
                <div className="flex flex-row justify-between md:items-center cursor-pointer">
                  <h3 className="font-bold text-xl">
                    Import activities from channels
                  </h3>
                  <IoClose size={30} onClick={handleClose} />
                </div>
                <p className="py-4 text-base">
                  Select channels to import activity in this workspace. Please
                  give Together Crew access to all selected private channels by
                  updating the channels permissions in Discord. Discord
                  permission will affect the channels the bot can see.
                </p>
              </div>
              <div className="border border-1 border-gray-300 px-4 py-4 rounded-lg max-h-[410px] overflow-y-scroll text-base">
                <div>
                  {channels && channels.length > 0
                    ? channels.map((guild: any, index: any) => {
                        return (
                          <div key={index} className="my-2">
                            <ChannelList
                              guild={guild}
                              onChange={onChange}
                              handleCheckAll={handleCheckAll}
                            />
                          </div>
                        );
                      })
                    : ''}
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <Button
                  className="bg-secondary text-white py-3 px-16 text-base"
                  onClick={submitChannels}
                >
                  Save channels
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
}
