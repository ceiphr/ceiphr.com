import { useContext } from 'react';

import Modal from '@components/Modal';
import {
    SettingsContext,
    SettingsModalContext,
    Settings as SettingsType // Rename to avoid issue with prettier formatting
} from '@contexts/useSettings';

const Settings = () => {
    const { open, setOpen } = useContext(SettingsModalContext);
    const { settings, setSettings } = useContext(SettingsContext);

    return (
        <Modal isOpen={open} setClosed={() => setOpen(false)}>
            <select
                className="text-black"
                value={settings.theme}
                onChange={(e) =>
                    setSettings({
                        ...settings,
                        theme: e.target.value as SettingsType['theme']
                    })
                }
            >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
        </Modal>
    );
};

export default Settings;
