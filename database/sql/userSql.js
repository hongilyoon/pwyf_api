exports.getUserList = "select * from user";

exports.getUserListById = "select * from user where id = ?";

exports.getUserListByTag = "select * from user where tag = ?";

exports.getUserListByDelYn = "select * from user where del_yn = 'N'";

exports.updateUserInfo = "UPDATE user SET name = ?, platform_seq = ?, region_seq = ?, tag = ? WHERE id = ?";

exports.insertUserInfo = "INSERT INTO user(`name`,`id`,`platform_seq`,`region_seq`,`tag`,`del_yn`)VALUES(?, ?, ?, ?, ?, 'N')";

exports.updateOverWatchUserInfo = "UPDATE user SET platform_seq = ?, region_seq = ?, tag = ? WHERE tag = ?";

exports.insertOverWatchUserInfo = "INSERT INTO user(`platform_seq`,`region_seq`,`tag`,`del_yn`)VALUES(?, ?, ?, 'N')";

exports.getUpdateUser = "SELECT u.seq AS seq, p.name AS platformName, r.name AS regionName, REPLACE(u.tag, '#', '-') AS tag FROM user u INNER JOIN platform p ON u.platform_seq = p.seq INNER JOIN region r ON u.region_seq = r.seq where u.id = ?";

exports.getUserJsonLastUpdateDate = "SELECT u.seq AS seq, u.id AS id, MAX(j.mod_date) AS modDate FROM user u LEFT OUTER JOIN json j ON u.tag = j.tag WHERE u.id = ? GROUP BY u.seq";