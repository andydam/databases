-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS chat;

CREATE DATABASE chat;

USE chat;


-- ---
-- Table 'messages'
-- holds all messages
-- ---

DROP TABLE IF EXISTS `messages`;
		
CREATE TABLE `messages` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'message id',
  `text` MEDIUMTEXT NOT NULL COMMENT 'message text',
  `user` INTEGER NOT NULL COMMENT 'user id',
  `room` INTEGER NOT NULL COMMENT 'room id',
  `time` INTEGER NOT NULL COMMENT 'utc time of message',
  PRIMARY KEY (`id`)
) COMMENT 'holds all messages';

-- ---
-- Table 'users'
-- list of users
-- ---

DROP TABLE IF EXISTS `users`;
		
CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `name` CHAR NOT NULL,
  PRIMARY KEY (`id`)
) COMMENT 'list of users';

-- ---
-- Table 'rooms'
-- list of rooms
-- ---

DROP TABLE IF EXISTS `rooms`;
		
CREATE TABLE `rooms` (
  `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT 'room id',
  `name` CHAR NOT NULL COMMENT 'room name',
  PRIMARY KEY (`id`)
) COMMENT 'list of rooms';

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `messages` ADD FOREIGN KEY (user) REFERENCES `users` (`id`);
ALTER TABLE `messages` ADD FOREIGN KEY (room) REFERENCES `rooms` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `rooms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

