import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Avatar, CardActionArea, CardHeader } from "@mui/material";
import { Article } from "utils/interfaces";
import { Link } from "react-router-dom";

interface Props {
  article: Article;
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardActionArea
        sx={{ height: "100%" }}
        component={Link}
        disabled={!article.url}
        rel="noreferrer"
        to={article.url}
        target="_blank"
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }} aria-label="first-letter">
              {article.author?.charAt(0)}
            </Avatar>
          }
          title={article.author}
          subheader={new Date(article.publishedAt).toLocaleString()}
        />
        <CardMedia
          component="img"
          height="140"
          image={article.urlToImage}
          alt="Article Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" fontWeight={500}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {article.content?.split("[+")[0]}
          </Typography>
        </CardContent>
        {/* Author, source, published at */}
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
