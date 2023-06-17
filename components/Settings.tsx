import { useContext } from 'react';

import Modal from '@components/Modal';
import { SettingsModalContext } from '@contexts/useSettings';

// TODO Fix this odd formatting error:
// components/Settings.tsx: TypeError: Cannot read properties of undefined (reading 'buildError')

const Settings = () => {
    const { open, setOpen } = useContext(SettingsModalContext);

    return (
        <Modal isOpen={open} setClosed={() => setOpen(false)}>
            <p>Hi</p>
        </Modal>
    );
};

export default Settings;
