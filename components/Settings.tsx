import { Dispatch, FunctionComponent, useContext } from 'react';

import { TbInfoCircle as Info } from 'react-icons/tb';

import Modal from '@components/ui/Modal';
import Radio from '@components/ui/Radio';
import Select from '@components/ui/Select';
import Toggle from '@components/ui/Toggle';
import {
    ActionTypes as ModalActionTypes,
    ModalsContext
} from '@contexts/useModals';
import {
    Action,
    ActionTypes,
    SettingsContext,
    Settings as SettingsType // Rename to avoid issue with prettier formatting
} from '@contexts/useSettings';
import { dntActive } from '@utils/dnt';

interface SettingProps {
    dispatch: Dispatch<Action>;
    settings: SettingsType;
}

const ThemeSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    const options = [
        {
            label: 'System',
            value: 'system'
        },
        {
            label: 'Dark',
            value: 'dark'
        },
        {
            label: 'Light',
            value: 'light'
        }
    ];
    const selected =
        options.find((option) => option.value === settings.theme) || options[0];

    return (
        <>
            <h3 className="text-lg font-bold">Theme</h3>
            <p className="text-sm">
                Select a color scheme. The <code>`system`</code> theme will
                follow your device&apos;s settings.
            </p>
            <Radio
                className="mt-2"
                srOnly="Theme"
                selected={selected}
                options={options}
                onChange={(value) =>
                    dispatch({
                        type: ActionTypes.SET_THEME,
                        payload: value as SettingsType['theme']
                    })
                }
            />
        </>
    );
};

const MotionSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    const options = [
        {
            label: 'System',
            value: 'system'
        },
        {
            label: 'Normal',
            value: 'normal'
        },
        {
            label: 'Reduce',
            value: 'reduce'
        },
        {
            label: 'None',
            value: 'none'
        }
    ];
    const selected =
        options.find((option) => option.value === settings.motion) ||
        options[0];

    return (
        <>
            <h3 className="text-lg font-bold">Motion</h3>
            <p className="text-sm">
                Change animation behavior. The <code>`system`</code> preference
                will follow your device&apos;s settings. Where as{' '}
                <code>`reduce`</code> motion will reduce the amount of
                animations.
            </p>
            <Select
                className="mt-2"
                selected={selected}
                options={options}
                onChange={(value) =>
                    dispatch({
                        type: ActionTypes.SET_MOTION,
                        payload: value as SettingsType['motion']
                    })
                }
            />
        </>
    );
};

const AdsSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    return (
        <>
            <h3 className="text-lg font-bold">Advertisements</h3>
            <p className="text-sm">
                Enable or disable advertisements. Because, <i>why not</i>?
            </p>
            <p className="text-sm text-gray-400 flex flex-row items-center">
                <Info className="inline-block mr-1" />
                Inferred by your device&apos;s DNT setting, because I respect
                your privacy.
            </p>
            <Toggle
                className="mt-2 mb-1"
                srOnly="Advertisements"
                checked={settings.ads}
                onChange={() =>
                    dispatch({
                        type: ActionTypes.SET_ADS,
                        payload: !settings.ads
                    })
                }
            />
        </>
    );
};

const AnalyticsSetting: FunctionComponent = () => {
    return (
        <>
            <h3 className="text-lg font-bold">Analytics</h3>
            <p className="text-sm">Enable or disable anonymous analytics.</p>
            <p className="text-sm text-gray-400 flex flex-row items-center">
                <Info className="inline-block mr-1" />
                Based on your device&apos;s DNT setting. To change, visit your
                browser&apos;s settings.
            </p>
            <Toggle
                className="mt-2 mb-1"
                disabled
                srOnly="Advertisements"
                checked={!dntActive()}
                onChange={() => {}}
            />
        </>
    );
};

const ShortcutsSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    return (
        <>
            <h3 className="text-lg font-bold">Shortcuts</h3>
            <p className="text-sm">Enable or disable keyboard shortcuts.</p>
            <Toggle
                className="mt-2"
                srOnly="Shortcuts"
                checked={settings.shortcuts}
                onChange={() =>
                    dispatch({
                        type: ActionTypes.SET_SHORTCUTS,
                        payload: !settings.shortcuts
                    })
                }
            />
        </>
    );
};

const Settings = () => {
    const {
        modals: { showSettings = false },
        dispatch: modalDispatch
    } = useContext(ModalsContext);
    const { settings, dispatch } = useContext(SettingsContext);

    return (
        <Modal
            show={showSettings}
            onClose={() =>
                modalDispatch({
                    type: ModalActionTypes.OPEN_SETTINGS,
                    payload: false
                })
            }
            title="Settings"
            className="h-lg flex flex-col"
        >
            <div className="divide-y divide-gray-800">
                <div className="pb-4">
                    <ThemeSetting dispatch={dispatch} settings={settings} />
                </div>
                <div className="py-4">
                    <MotionSetting dispatch={dispatch} settings={settings} />
                </div>
                <div className="py-4">
                    <AdsSetting dispatch={dispatch} settings={settings} />
                </div>
                <div className="py-4">
                    <AnalyticsSetting />
                </div>
                <div className="pt-4">
                    <ShortcutsSetting dispatch={dispatch} settings={settings} />
                </div>
            </div>
            <div className="pointer-events-none bg-gradient-to-t from-black to-transparent w-full h-12 absolute bottom-0 left-0" />
        </Modal>
    );
};

export default Settings;
