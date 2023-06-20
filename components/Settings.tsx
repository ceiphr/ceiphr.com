import { useContext } from 'react';

import { Listbox, Switch } from '@headlessui/react';
import { TbX as XIcon } from 'react-icons/tb';

import Modal from '@components/ui/Modal';
import {
    ActionTypes,
    SettingsContext,
    SettingsModalContext,
    Settings as SettingsType // Rename to avoid issue with prettier formatting
} from '@contexts/useSettings';

const Settings = () => {
    const { open, setOpen } = useContext(SettingsModalContext);
    const { settings, dispatch } = useContext(SettingsContext);

    return (
        <Modal
            open={open}
            setOpen={(open) => setOpen(open)}
            className="h-lg flex flex-col"
        >
            <div className="p-6">
                <button
                    className="text-gray-500 hover:text-gray-300 absolute top-6 right-6"
                    onClick={() => setOpen(false)}
                >
                    <XIcon className="w-5 h-5" />
                </button>
                <h1 className="text-4xl font-heading">Settings</h1>
                <div className="mt-6 divide-y divide-gray-800">
                    <div className="pb-4">
                        <h3 className="text-xl font-bold">Theme</h3>
                        <p className="text-sm">
                            Select a color scheme. The <code>`system`</code>{' '}
                            theme will follow your device&apos;s settings.
                        </p>
                        <select
                            className="text-black mt-2"
                            value={settings.theme}
                            onChange={(e) =>
                                dispatch({
                                    type: ActionTypes.SET_THEME,
                                    payload: e.target
                                        .value as SettingsType['theme']
                                })
                            }
                        >
                            <option value="system">System</option>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>
                    <div className="py-4">
                        <h3 className="text-xl font-bold">Motion</h3>
                        <p className="text-sm">
                            Change animation behavior. The <code>`system`</code>{' '}
                            preference will follow your device&apos;s settings.
                            Where as <code>`reduce`</code> motion will reduce
                            the amount of animations.
                        </p>

                        <Listbox
                            value={settings.motion}
                            onChange={(value) =>
                                dispatch({
                                    type: ActionTypes.SET_MOTION,
                                    payload: value as SettingsType['motion']
                                })
                            }
                        >
                            <div className="mt-2 relative">
                                <Listbox.Button>
                                    <span className="block truncate">
                                        {settings.motion}
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options>
                                    {[
                                        'system',
                                        'normal',
                                        'reduced',
                                        'none'
                                    ].map((motion) => (
                                        <Listbox.Option
                                            key={motion}
                                            className={({ active }) =>
                                                `${
                                                    active
                                                        ? 'text-blue-900 bg-blue-100'
                                                        : 'text-gray-900'
                                                } cursor-default select-none relative py-2 pl-10 pr-4`
                                            }
                                            value={motion}
                                        >
                                            {motion}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>
                    <div className="pt-4">
                        <h3 className="text-xl font-bold">Advertisements</h3>
                        <p className="text-sm">
                            Enable or disable advertisements.
                            <span className="ml-2 text-sm text-gray-400">
                                This may be inferred by your device&apos;s DNT
                                setting.
                            </span>
                        </p>
                        <Switch
                            checked={settings.ads}
                            onChange={() =>
                                dispatch({
                                    type: ActionTypes.SET_ADS,
                                    payload: !settings.ads
                                })
                            }
                            className={`${
                                settings.ads ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11 mt-2`}
                        >
                            <span className="sr-only">
                                Enable advertisements
                            </span>
                            <span
                                className={`${
                                    settings.ads
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                        </Switch>
                    </div>
                    <div className="pt-4">
                        <h3 className="text-xl font-bold">Shortcuts</h3>
                        <p className="text-sm">
                            Enable or disable keyboard shortcuts.
                        </p>
                        <Switch
                            checked={settings.shortcuts}
                            onChange={() =>
                                dispatch({
                                    type: ActionTypes.SET_SHORTCUTS,
                                    payload: !settings.shortcuts
                                })
                            }
                            className={`${
                                settings.shortcuts
                                    ? 'bg-blue-600'
                                    : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11 mt-2`}
                        >
                            <span className="sr-only">
                                Enable keyboard shortcuts
                            </span>
                            <span
                                className={`${
                                    settings.shortcuts
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                        </Switch>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Settings;
