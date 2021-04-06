import React from 'react';
import {
    Box,
    createStyles,
    Grid,
    SvgIconProps,
    withStyles,
} from "@material-ui/core";
import {  BaseText, Subheading } from "../Shared/Typography";

interface IconCard {
    Icon: React.ComponentType<SvgIconProps>;
    text: string;
    title: string;
}

export const IconCard: React.FC<IconCard> = ({ Icon, text, title }) => (
    <Box p={3} flexGrow={1}>
        <Grid container item>
            <Grid item container justify="flex-end" alignItems="center" xs={4}>
                <IconCardIcon Icon={Icon} />
            </Grid>
            <Grid item container direction="column" xs={8}>
                <Subheading>{title}</Subheading>
                <BaseText>{text}</BaseText>
            </Grid>
        </Grid>
    </Box>
);

export const IconCardIcon: React.FC<{ Icon: React.ComponentType<SvgIconProps> }> = ({ Icon }) => {
    const StyledIcon = withStyles((theme) =>
        createStyles({
            root: {
                color: theme.palette.primary.light,
                fontSize: "124px",
                [theme.breakpoints.down("lg")]: { fontSize: "90px" },
            },
        })
    )(Icon);

    return <StyledIcon />;
};
