import React from 'react';
import {
    makeStyles,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';

export default function CustomAccordion() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <Accordion
            square
            expanded={expanded === 'header'}
            onChange={handleChange('header')}
            className={classes.collapse}
            TransitionProps={{
                timeout: 600,
                unmountOnExit: true
            }}
        >
            <AccordionSummary className="summary">
                summary
            </AccordionSummary>
            <AccordionDetails className="detail">
                detail
            </AccordionDetails>
        </Accordion>
    );
}

const useStyles = makeStyles((theme) => ({
    collapse: {
        boxShadow: 'unset',
        margin: '0px !important',
        position: 'unset',
        '& .summary': {
            display: 'flex',
            alignItems: 'center',
            height: 60,
            minHeight: 'unset !important',
            padding: `0px ${theme.spacing(2)}px`,
            borderBottom: '1px solid #E8E8EF',
        },
        '& .detail': {
            padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(4)}px`,
            background: "#F7F7FA",
            display: 'flex',
            flexFlow: 'column',
        }
    },
}));
