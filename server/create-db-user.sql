USE okaly;

SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE user_levels (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(20) DEFAULT NULL
);

CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `birthday` DATE DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `postcode` VARCHAR(10) DEFAULT NULL,
  `city` VARCHAR(50) DEFAULT NULL,
  `area` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `img` VARCHAR(255) DEFAULT NULL,
  `level_id` INT(11) DEFAULT 1,  
  `is_valid` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_level` FOREIGN KEY (`level_id`) REFERENCES `user_levels`(`id`)
    ON UPDATE CASCADE
);


INSERT INTO user_levels (`id`, `name`) VALUES
(1, '木芽會員'),
(2, '原木會員'),
(3, '森林會員');

