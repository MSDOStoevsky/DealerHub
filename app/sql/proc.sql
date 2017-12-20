DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_client`(INnme VARCHAR(45), IN email VARCHAR(45), IN pn VARCHAR(45))
BEGIN
	INSERT INTO `Clients` (`name`, `email`, `phone`) 
    VALUES (nme, email, pn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_admin`(IN nme VARCHAR(45), IN email VARCHAR(45), IN pass VARCHAR(100))
BEGIN
	INSERT INTO `Admins` (`name`, `email`, `pw`)
    VALUES (nme, email, pass);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_clients`()
BEGIN
	SELECT 
	c.`id`
	, c.`name`
	, c.`email`
	, c.`phone`
	, c.`joined`
	, MAX(cl.`click_date`) as last_click
	, COUNT(cl.`id`) as total_clicks
	FROM Clients c 
	LEFT JOIN Clicks cl ON c.`id` = cl.`client_id`
	GROUP BY c.id;
END$$
DELIMITER ;

