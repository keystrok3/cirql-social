import React, { useEffect } from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { elapsed_time } from "../../utils/elapsed_time";

// Example notification dictionary
const notification_dictionary = {
  Like: "liked",
  Comment: "commented on",
  Repost: "reposted"
};

const NotificationItem = ({ notf }) => {
  console.log('Notification page notf: ', notf)
  const actor = notf?.actor;
  const profilePhoto = notf?.actorInfo?.profile_photo;

  useEffect(() => {
    console.log('Notification Item: ', notf)
  }, [])

  return (
    <ListItem alignItems="flex-start" divider>
      {/* Avatar */}
      <ListItemAvatar>
        <Avatar alt={actor} src={profilePhoto || undefined}>
          {!profilePhoto && actor?.split("")[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>

      {/* Notification text */}
      <ListItemText
        primary={`@${actor} ${notification_dictionary[notf?.sourceType]} your post`}
        secondary={elapsed_time(notf.createdAt)}
      />
    </ListItem>
  );
};

export default NotificationItem;
