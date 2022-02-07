export default {
    MuiButton: {
        root: {
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 120,
            boxShadow: '0px 1px 1px -1px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important'
        }
    },
    MuiInputBase: {
        root: {
            boxSizing: 'border-box',
            borderRadius: '8px !important',
            border: '2px solid #F2F2FE',
            background: '#F6F6FE',
            fontSize: 16,
            width: '100%',
            minWidth: 200,
            '&:before': {
                content: 'none !important'
            },
            '&:after': {
                content: 'none !important'
            },
            '& input': {
                height: 50,
                boxSizing: 'border-box',
                color: '#546E7A',
                padding: 16,
            },
            '& textarea': {
                color: '#546E7A',
                boxSizing: 'border-box',
                padding: 16,
            },
            '& .MuiSelect-icon': {
                marginRight: 8
            }
        },
    },
    MuiSelect: {
        root: {
            height: '35px !important',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
        }
    },
    MuiCard: {
        root: {
            boxShadow: 'unset',
            borderRadius: 20
        }
    },
    MuiDialog: {
        paper: {
            boxShadow: 'unset',
            borderRadius: 13,
            margin: 18,
            width: '100%',
        }
    }
};
