import React, { useContext, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import StyledTabs from '../../components/styled-tabs';
import StyledTab from '../../components/styled-tab';
import { PageContext } from '../../utils/client/page-state';
import { getLanguage } from '../../langauge/language';
import SvgLeftArrow from '../../../public/left-arrow.svg';
import Sections from './sections';
import Settings from './settings';
import SectionPatterns from './section-patterns';

const borderStyle = '1px solid #E8E8EF';

export default function PageEditorSidebar() {
    const classes = useStyles();
    const [tabIdx, setTabIdx] = useState<number>(0);
    const [status, setStatus] = useState<'examples' | 'sections' | 'settings'>('sections');
    const pageCtx = useContext(PageContext);

    const handleGoBack = () => {
        if (status === 'examples') {
            return setStatus(() => 'sections')
        }

        return window.location.href = `/my-sites/${pageCtx.pageState.site.url}`
    }

    return (
        <Box
            display='grid'
            gridTemplateRows={`83px ${status === 'examples' ? '' : '50px'} 1fr`}
            maxHeight='100vh'
            className={classes.root}
        >
            {/* header */}
            <Box
                display="grid"
                gridTemplateColumns="11px calc(100% - 11px)"
                gridGap={11}
                p={2}
                className={classes.header}
                borderBottom={borderStyle}
                style={{ cursor: 'pointer' }}
                onClick={handleGoBack}
            >
                {/* back icon */}
                <SvgLeftArrow width={11} height={11} />
                <Box display="flex" flexDirection="column" justifyContent="space-between" >
                    <Typography variant="h6" color="textSecondary">
                        {status === 'examples' ? getLanguage().back : getLanguage().backToPages}
                    </Typography>
                    <Typography variant="h5" color="textPrimary" className="turncate">
                        {pageCtx.pageState.page?.title ?? ''}
                    </Typography>
                </Box>
            </Box>
            {
                status !== 'examples' ?
                    <>
                        {/* tab */}
                        <Box position="relative" borderBottom={borderStyle}>
                            <StyledTabs value={tabIdx} onChange={(event, newValue) => setTabIdx(newValue)} indicatorwidth="100%">
                                <StyledTab label={getLanguage().sections} />
                                <StyledTab label={getLanguage().settings} />
                            </StyledTabs>

                            {/* inner line */}
                            <Box display="flex" alignItems="center" position="absolute" top={15} left={175}>
                                <Box height={20} width={0} border={borderStyle} />
                            </Box>
                        </Box>

                        {/* sections or settings part */}
                        {tabIdx === 0 && <Sections onGoExamples={() => setStatus('examples')} />}
                        {tabIdx === 1 && <Settings />}
                    </>
                    :
                    <SectionPatterns />
            }
        </Box >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.background.paper,
        boxShadow: '0px 0px 15px rgba(167, 167, 194, 0.2)',
        '& button': {
            height: 48
        },
        '& img': {
            cursor: 'pointer',
            objectFit: 'unset !important'
        },
        '& .turncate': {
            whiteSpace: 'nowrap',
            marginRight: theme.spacing(1)
        }
    },
    header: {
        overflow: 'hidden',
        '& h6': {
            cursor: 'pointer'
        },
        '& svg': {
            alignSelf: 'start',
            marginTop: theme.spacing(0.5),
        },
    },
}));
