import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { PanelProps } from "@components/MaterialUI";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    cardHeader: {
        fontSize: "1.1rem",
    },
    cardBody: {
        fontSize: "0.8rem",
    },
    attribution: {
        fontSize: "0.9rem"
    }
});

export interface DatasetRecord {
    title: string;
    description: string;
    accession: string;
    date: string;
    attribution: string;
    tracks: string[];
    genomeBuild?: string;
}

interface CardProps {
    dataset: DatasetRecord;
}

export const DatasetCard: React.FC<CardProps & PanelProps> = (props) => {
    const classes = useStyles();
    const panelClasses = props.classes;
    const { title, description, accession, date, attribution, tracks } = props.dataset;

    const img = props.webAppUrl + "/images/manhattan/" + accession + "/png/" + tracks[0] + "-manhattan.png";
    const track = props.webAppUrl === "genomics" && !tracks[0].includes('GRCh38') ? tracks[0].replace('_', '_GRCh38_') : tracks[0];
    const url = props.webAppUrl + "/app/record/track/" + track; 
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia component="img" alt={title} height="140" image={img} title={title} />
                <CardContent>
                    {date && (
                        <Typography variant="caption" color="textSecondary" component="p">
                            Release Date: {date}
                        </Typography>
                    )}
                    <Typography gutterBottom variant="h5" component="h2" className={classes.cardHeader}>
                        {accession}: {title}
                    </Typography>
                    {attribution && (
                        <Typography gutterBottom variant="h5" component="h5" className={classes.attribution}>
                            {attribution}
                        </Typography>
                    )}
                    <Typography variant="body1" color="textSecondary" component="p" className={classes.cardBody}>
                        {description}{" "}
                        <Button href={url} size="small" color="secondary">
                            Learn More
                        </Button>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
