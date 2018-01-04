DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_client`(IN adm_id INT(11),IN nme VARCHAR(45), IN email VARCHAR(45), IN pn VARCHAR(45))
BEGIN
	INSERT INTO `Clients` (`name`, `email`, `phone`) 
    VALUES (nme, email, pn);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_link`(IN adm_id INT(11),IN nme VARCHAR(45), IN link VARCHAR(2083))
BEGIN
	INSERT INTO `Links` (`admin_id`, `name`, `URL`) 
    VALUES (adm_id, nme, link);
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


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_links`(IN ref VARCHAR(45))
BEGIN
	IF (SELECT `ref_expr` FROM `Links` WHERE `ref`=ref) > NOW() THEN
		SELECT 
		l.`id`
		, l.`name`
		, l.`URL`
		FROM Links l 
		LEFT JOIN Clients cl ON l.`admin_id` = cl.`admin_id`
		LEFT JOIN Referrals ref ON ref.`client_id` = cl.`client_id`
		WHERE ref.`referral` = ref;
	END IF;
END$$
DELIMITER ;
