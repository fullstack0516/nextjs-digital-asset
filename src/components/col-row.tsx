import React from 'react';

export const Col = (props?: {
    className?: string;
    style?: React.HTMLAttributes<HTMLDivElement>['style'];
    children: any;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
    return (
        <div
            className={props?.className}
            onClick={props?.onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                ...props?.style,
            }}
        >
            {props?.children}
        </div>
    );
};

export const Row = (props?: {
    className?: string;
    style?: React.HTMLAttributes<HTMLDivElement>['style'];
    children: any;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
    return (
        <div
            className={props?.className}
            onClick={props?.onClick}
            style={{
                display: 'flex',
                flexDirection: 'row',
                ...props?.style,
            }}
        >
            {props?.children}
        </div>
    );
};
