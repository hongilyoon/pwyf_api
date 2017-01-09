exports.getUserList = "select * from user";

exports.getUserListById = "select * from user where id = ?";

exports.getUserListByDelYn = "select * from user where del_yn = 'N'";

exports.updateUserInfo = "UPDATE user SET name = ?, platform_seq = ?, region_seq = ?, tag = ? WHERE id = ?";

exports.insertUserInfo = "INSERT INTO user(`name`,`id`,`platform_seq`,`region_seq`,`tag`,`del_yn`)VALUES(?, ?, ?, ?, ?, 'N')";

exports.getNotUpdatedUser = "select u.seq as seq, p.name as platformName, r.name as regionName, replace(u.tag, '#', '-') as tag, j.seq as jsonSeq from user u inner join platform p on u.platform_seq = p.seq inner join region r on u.region_seq = r.seq LEFT OUTER JOIN json j ON u.seq = j.user_seq AND j.mod_date < DATE_ADD(NOW(), INTERVAL -1 day) ";