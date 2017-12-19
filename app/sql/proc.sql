CREATE DEFINER=`root`@`localhost` PROCEDURE `add_client`(INnme VARCHAR(45), IN email VARCHAR(45), IN pn VARCHAR(45))
BEGIN
	INSERT INTO `Clients` (`name`, `email`, `phone`) 
    VALUES (nme, email, pn);
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_admin`(IN nme VARCHAR(45), IN email VARCHAR(45), IN pass VARCHAR(45))
BEGIN
	INSERT INTO `Admins` (`name`, `email`, `pw`)
    VALUES (nme, email, pass);
END