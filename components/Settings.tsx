import { Dispatch, FunctionComponent, useContext } from 'react';

import { TbX as XIcon } from 'react-icons/tb';

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
            <h3 className="text-xl font-bold">Theme</h3>
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
            <h3 className="text-xl font-bold">Motion</h3>
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

const AdvertisementsSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    return (
        <>
            <h3 className="text-xl font-bold">Advertisements</h3>
            <p className="text-sm">
                Enable or disable advertisements.
                <span className="ml-2 text-sm text-gray-400">
                    This may be inferred by your device&apos;s DNT setting.
                </span>
            </p>
            <Toggle
                className="mt-2"
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

const ShortcutsSetting: FunctionComponent<SettingProps> = ({
    dispatch,
    settings
}) => {
    return (
        <>
            <h3 className="text-xl font-bold">Shortcuts</h3>
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
            <div className="mt-6 divide-y divide-gray-800">
                <div className="pb-4">
                    <ThemeSetting dispatch={dispatch} settings={settings} />
                </div>
                <div className="py-4">
                    <MotionSetting dispatch={dispatch} settings={settings} />
                </div>
                <div className="py-4">
                    <AdvertisementsSetting
                        dispatch={dispatch}
                        settings={settings}
                    />
                </div>
                <div className="pt-4">
                    <ShortcutsSetting dispatch={dispatch} settings={settings} />
                </div>
            </div>
        </Modal>
    );
};

export default Settings;
