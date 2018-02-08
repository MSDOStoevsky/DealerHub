DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_client`(IN adm_id INT(11),IN nme VARCHAR(45), IN email VARCHAR(45), IN pn VARCHAR(45))
BEGIN
	INSERT INTO `Clients` (`admin_id`, `name`, `email`, `phone`) 
    VALUES (adm_id, nme, email, pn);
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `upd_client`(IN cid INT(11), IN pn VARCHAR(45))
BEGIN
	START TRANSACTION;
	UPDATE `Client` SET `phone` = pn WHERE `id` = cid;
    COMMIT;
END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_referral`(IN cli_id INT(11), IN adm_id INT(11), IN ref VARCHAR(45))
BEGIN
	IF (SELECT COUNT(`id`) FROM `Referrals` WHERE `client_id` = cli_id) <= 0 THEN
		INSERT INTO `Referrals` (`client_id`, `admin_id`, `referral`)
        VALUES (cli_id, adm_id, ref);
	ELSE
		UPDATE `Referrals`
        SET `referral` = ref
        WHERE `client_id` = cli_id AND `admin_id` = adm_id;
	END IF;
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
    , IFNULL(ref.`referral`, "None") as referral
	FROM Clients c 
	LEFT JOIN Clicks cl ON c.`id` = cl.`client_id`
	LEFT JOIN Referrals ref ON c.`id` = ref.`client_id`
	GROUP BY c.id
    ORDER BY last_click DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_clicks`(IN adm_id INT(11))
BEGIN
	SELECT 
    cl.`id`
    , c.`name`
    , c.`email`
    , l.`name` as link_name
    , cl.`click_date`
    FROM `Clicks` cl
    LEFT JOIN `Clients` c ON c.`id` = cl.`client_id`
    LEFT JOIN `Links` l ON l.`id` = cl.`link_id`
    WHERE c.`admin_id` = adm_id
    ORDER BY cl.`click_date` DESC;
    
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_links`(IN ref VARCHAR(45))
BEGIN
	IF (SELECT `ref_expr` FROM `Referrals` WHERE `ref`=ref) > NOW() THEN
		SELECT 
		l.`id`
		, l.`name`
		, l.`URL`
		FROM Links l 
		LEFT JOIN Clients cl ON l.`admin_id` = cl.`admin_id`
		LEFT JOIN Referrals ref ON ref.`client_id` = cl.`id`
		WHERE ref.`referral` = ref;
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `rmv_client`(IN cid INT(11), IN adm_id INT(11))
BEGIN
	START TRANSACTION;
	DELETE FROM `Clients` WHERE `id` = cid AND `admin_id` = adm_id;
	DELETE FROM `Referrals` WHERE `client_id` = id AND `admin_id` = adm_id;
	DELETE FROM `Clicks` WHERE `client_id` = cid;
    COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `rmv_link`(IN lid INT(11), IN adm_id INT(11))
BEGIN
	START TRANSACTION;
	DELETE FROM `Links` WHERE `id` = lid AND `admin_id` = adm_id;
	COMMIT;
END$$
DELIMITER ;


