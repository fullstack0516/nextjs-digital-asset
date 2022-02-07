import { Box, Typography } from "@material-ui/core";
import { User } from "../models/user";
import { UserLight } from "../models/user-light";
import { getNameInitials } from "../utils/helpers";

export default function CommentAvatar({
    width = 48,
    user
}: {
    width?: number | string,
    user?: UserLight | User
}) {

    const { profileMedia, username } = user ?? {}

    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            style={{
                background: profileMedia?.url ? `url(${profileMedia?.url})` : '#F8F0EC',
                backgroundSize: 'cover',
                borderRadius: 12,
                width,
                height: width
            }}
        >
            {
                !profileMedia?.url &&
                <Typography variant="h5" color="textPrimary" style={{ fontWeight: 600 }}>
                    {getNameInitials(username ?? '')}
                </Typography>
            }
        </Box>
    )
}
