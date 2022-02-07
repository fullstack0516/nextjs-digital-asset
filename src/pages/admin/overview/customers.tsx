import React, { useState } from 'react';
import { Box, makeStyles, Typography, Avatar, Tooltip } from '@material-ui/core';
import { getLanguage } from '../../../langauge/language';
import CustomDivider from '../../../components/custom-divider';
import ConfirmDialog from '../../../components/confirm-dialog';
import { Player } from '@lottiefiles/react-lottie-player';
import fetching from '../../../../public/lottie/loading-fetch.json';
import { User } from '../../../models/user';
import { sortByProperty } from '../../../utils/helpers';
import {
    Slash as SlashIcon,

} from 'react-feather'

export default function Customers(props: {
    dataMap: { [customerId: string]: User },
    onShowMore?: () => void,
    onBlock?: () => void
}) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleShowMore = async () => {
        setIsLoading(() => true);
        if (props?.onShowMore) {
            await props.onShowMore()
        }
        setIsLoading(false);
    }

    const handleBlock = () => {
        setOpen(() => false);
        props?.onBlock && props.onBlock();
    }

    const customers = sortByProperty(props?.dataMap, 'createdIso', 'desc');

    return (
        <Box className={classes.root} mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <Typography variant="h6" color="textSecondary" component="p">
                    {getLanguage().newCustomers}
                </Typography>
            </Box>
            <CustomDivider />
            <Box display="flex" flexDirection="column" p={3}>
                {
                    customers.map(customer =>
                        <Box display="grid" gridTemplateColumns="42px calc(100% - 94px) 20px" gridGap={16} alignItems="center" mb={3} className="customer" key={customer.uid} >
                            <Avatar alt="logo" className="avatar" src={customer.profileMedia.url} />
                            <Box display="flex" flexDirection="column" justifyContent="space-between">
                                <Typography variant="h6" color="textPrimary" className="turncate name">{customer.username}</Typography>
                                <Typography color="textSecondary" className="turncate id">{`${getLanguage().customerID}#${customer.uid}`}</Typography>
                            </Box>
                            <Tooltip title='Block' placement='top' arrow>
                                <Box display="flex" justifyContent="space-between" alignItems="center" className="actions">
                                    <SlashIcon onClick={() => setOpen(() => true)} />
                                </Box>
                            </Tooltip>
                        </Box>
                    )
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height={55} className="showMore" onClick={handleShowMore}>
                {
                    isLoading &&
                    <Player
                        autoplay
                        loop
                        src={JSON.stringify(fetching)}
                        style={{ height: 35, width: 35, marginRight: 8 }}
                    />
                }
                <Typography component="span" color="primary">{getLanguage().viewMoreCustomers}</Typography>
            </Box>
            {/* Confirm Dialog */}
            <ConfirmDialog open={open} onClose={() => setOpen(() => false)} onSave={handleBlock} message={getLanguage().sureToBlockThisUser} />
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        maxWidth: 500,
        width: '100%',
        borderRadius: theme.spacing(2.5),
        '& p': {
            lineHeight: '16px',
            fontWeight: 500,
        },
        '& svg': {
            color: '#92929D',
            cursor: 'pointer'
        },
        '& .customer': {
            '& .name': {
                fontWeight: 'bold'
            },
            '& .id': {
                fontSize: 12,
            },
            '& .avatar': {
                width: 42,
                height: 42,
            },
            '& .actions': {
                '& svg': {
                    width: 20,
                }
            }
        },
        '& .showMore': {
            borderRadius: '0px 0px 15px 15px',
            background: '#FFF8F5',
            cursor: 'pointer',
            '& span': {
                fontSize: 12,
                letterSpacing: 0.8,
                fontWeight: 500,
                textTransform: 'uppercase',
            }
        }
    },
}));
