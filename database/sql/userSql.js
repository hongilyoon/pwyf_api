exports.getUserList = "select * from user";

exports.getUserListById = "select * from user where id = ?";

exports.getUserListByDelYn = "select * from user where del_yn = 'N'";

exports.updateUserInfo = "UPDATE user SET name = ?, platform_seq = ?, region_seq = ?, tag = ? WHERE id = ?";

exports.insertUserInfo = "INSERT INTO user(`name`,`id`,`platform_seq`,`region_seq`,`tag`,`del_yn`)VALUES(?, ?, ?, ?, ?, 'N')";

exports.getUpdateUserList = "SELECT A.* FROM ( SELECT u.seq AS seq, p.name AS platformName, r.name AS regionName, REPLACE(u.tag, '#', '-') AS tag, max(j.mod_date) as modDate FROM user u INNER JOIN platform p ON u.platform_seq = p.seq INNER JOIN region r ON u.region_seq = r.seq LEFT OUTER JOIN json j ON u.seq = j.user_seq group by u.seq, u.platform_seq, u.region_seq, u.tag ) A WHERE A.modDate is null or A.modDate < DATE_ADD(NOW(), INTERVAL - 1 hour)";

exports.getUpdateUser = "SELECT u.seq AS seq, p.name AS platformName, r.name AS regionName, REPLACE(u.tag, '#', '-') AS tag FROM user u INNER JOIN platform p ON u.platform_seq = p.seq INNER JOIN region r ON u.region_seq = r.seq where u.id = ?";