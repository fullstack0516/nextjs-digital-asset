import React, { createContext } from 'react';
import { useReducer } from 'react';
import Modal from 'react-modal';
import { createUid } from './helpers-generic';

type ModalState = {
    modals: ModalAction[];
};

export type ModalAction = {
    type: 'add' | 'hide' | 'replace' | 'hideAll' | 'replaceAll';
    modal?: JSX.Element;
    customContainerStyle?: React.CSSProperties;
    // For keys on React.
    uid?: string;
};

const initialState: ModalState = {
    modals: [],
};

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
    if (!action.uid) {
        action.uid = createUid();
    }
    switch (action.type) {
        case 'add':
            if (!action.modal) {
                return state;
            }
            return {
                ...state,
                modals: [...state.modals, action],
            };
        case 'replace':
            if (!action.modal) {
                return state;
            }
            const newModals = [...state.modals];
            newModals[newModals.length - 1] = action;
            return {
                ...state,
                modals: newModals,
            };
        case 'replaceAll':
            if (!action.modal) {
                return state;
            }
            const modals = [action];
            return {
                ...state,
                modals: modals,
            };
        case 'hide':
            return {
                ...state,
                modals: state.modals.slice(0, -1),
            };
        case 'hideAll':
            return {
                ...state,
                modals: [],
            };
        default:
            throw new Error('No action of type: ' + action.type);
    }
};

export const ModalContext = createContext<{
    modalState: ModalState;
    dispatchModal: React.Dispatch<ModalAction>;
}>({
    modalState: initialState,
    dispatchModal: () => null,
});

export let dispatchModal: React.Dispatch<ModalAction>;

export const ModalStoreProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(modalReducer, initialState);

    const renderModal = (modalAction: ModalAction) => {
        const customStyle = {
            content: modalAction?.customContainerStyle ?? {},
        };
        return (
            <Modal
                key={modalAction.uid}
                closeTimeoutMS={500}
                isOpen={!!modalAction}
                onRequestClose={() => {
                    dispatchModal({ type: 'hide' });
                }}
                style={customStyle}
                ariaHideApp={false}
            >
                {modalAction?.modal ?? <div />}
            </Modal>
        );
    };

    dispatchModal = dispatch;

    return (
        <ModalContext.Provider value={{ modalState: state, dispatchModal: dispatch }}>
            {children}
            {state.modals.map((d) => renderModal(d))}
        </ModalContext.Provider>
    );
};
