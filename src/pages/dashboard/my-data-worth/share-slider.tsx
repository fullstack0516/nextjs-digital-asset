import React, { useState, useEffect } from 'react';
import { Box, makeStyles, Slider, withStyles } from '@material-ui/core';
import { useWindowSize } from '../../../utils/client/use-window-size';

const PrettoSlider = withStyles({
	root: {
		color: '#FE7435',
		height: 8,
		padding: '28px 0px',
	},
	thumb: {
		height: 64,
		width: 64,
		border: 'solid 1px',
		backgroundColor: '#fff',
		backgroundImage: `url("../../thumb-arrow.svg")`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		marginTop: -28,
		marginLeft: -32,
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	active: {},
	valueLabel: {
		left: 'calc(-50% + 4px)',
	},
	track: {
		height: 8,
		borderRadius: 4,
	},
	rail: {
		height: 8,
		borderRadius: 4,
	},
})(Slider);

const PrettoVerticalSlider = withStyles({
	root: {
		color: "#FE7435",
		height: 8,
	},
	thumb: {
		left: -3,
		height: 64,
		width: "64px !important",
		backgroundColor: "#fff",
		border: 'solid 1px',
		backgroundImage: `url("../../thumb-arrow.svg")`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		transform: 'rotate(90deg)',
		"&:focus,&:hover,&$active": {
			boxShadow: "inherit"
		}
	},
	active: { width: "14px" },
	track: {
		height: 24,
		width: "10px !important",
		borderRadius: 24
	},
	rail: {
		height: 24,
		width: "10px !important",
		borderRadius: 24,
	//   opacity: 1,
	//   color: '#F2F7FA'
	}
})(Slider);

export default function ShareSlider(props: {
	dataValue: number,
	name?: string,
	onSetLevel: (val: number) => void
}) {
	const classes = useStyles();
	const [shareValue, setShareValue] = useState<number>(0);
	const size = useWindowSize()

    useEffect(() => {
		props.onSetLevel(shareValue)
    }, [shareValue])

	let slider;
	if (size.width > 599) {
		slider = <PrettoSlider aria-label="pretto slider" max={100} onChange={(e, val) => setShareValue(Number(val)/50)} />
	} else {
		slider = <PrettoVerticalSlider orientation="vertical" aria-label="pretto slider" aria-labelledby="vertical-slider" defaultValue={0} max={100} onChange={(e, val) => setShareValue(Number(val)/50)} />
	}
	return (
		<>
			<Box className={classes.root}>
				<Box  className={classes.verticalSlider}>
					{slider}
				</Box>

				<Box className={classes.levelCaption}>
					<span style={{ opacity: shareValue <= 0.5 ? '1' : '0.3' }}>I share nothing</span>
					<span style={{ opacity: ((shareValue > 0.5 ) && (shareValue <= 1.5)) ? '1' : '0.3' }}>Semi-private</span>
					<span style={{ opacity: (shareValue > 1.5) ? '1' : '0.3' }}>Everything</span>
				</Box>
			</Box>
		</>
	)
}

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: '628px',
		width: '80%',
		margin: 'auto',
		marginTop: '48px',
		marginBottom: '52px',
		[theme.breakpoints.down('xs')]: {
			display: 'flex',
            maxWidth: 'auto',
			justifyContent: 'center',
			left: '0px'
        },
	},
	levelCaption: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		font: 'Roboto',
		fontSize: '16px',
		marginTop: '12px',
		[theme.breakpoints.down('xs')]: {
			height: '300px',
			flexDirection: 'column-reverse',
			width: 'auto',
			alignItems: 'start',
			marginTop: '0px',
			paddingLeft: '20px',
        },
	},
	levelColor: {
		opacity: '0.3'
	},
	verticalSlider: {
		height: 'auto',
		[theme.breakpoints.down('xs')]: {
			display: 'flex',
			height: '300px',
        },
	}
}));
