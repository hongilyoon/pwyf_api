// 친구 목록의 총개수를 조회합니다.
exports.getFriendsAttributesListTotalCount = "SELECT " +
    "    COUNT(*) AS cnt " +
    "FROM " +
    "    (SELECT  " +
    "        '0' AS type " +
    "    FROM " +
    "        user u, json j " +
    "    WHERE " +
    "        u.seq = j.user_seq " +
    "            AND id = ? " +
    "            AND j.type = ?  " +
    "UNION  " +
    " SELECT  " +
    "        '1' AS type " +
    "    FROM " +
    "        hello_friends h, json j, user u " +
    "    WHERE " +
    "        h.friends_seq = j.user_seq " +
    "            AND h.friends_seq = u.seq " +
    "            AND h.user_seq = (SELECT  " +
    "                seq " +
    "            FROM " +
    "                user " +
    "            WHERE " +
    "                id = ?) " +
    "            AND j.type = ?  " +
    "UNION  " +
    " SELECT  " +
    "        '2' AS type " +
    "    FROM " +
    "        facebook_friends f, user u " +
    "    WHERE " +
    "        f.user_seq = u.seq  " +
    "        AND u.id = ? " +
    "        AND f.friends_id NOT IN (SELECT " +
    "                u.id " +
    "            FROM " +
    "                hello_friends h, user u" +
    "            WHERE " +
    "                h.friends_seq = u.seq)) A ";


exports.getFriendsAttributesList = "SELECT " +
    "    A.* " +
    "FROM " +
    "    (SELECT  " +
    "        '0' AS type, u.seq AS seq, u.name AS name, u.id AS id, u.tag AS tag, j.json AS json " +
    "    FROM " +
    "        user u, json j " +
    "    WHERE " +
    "        u.seq = j.user_seq " +
    "            AND id = ? " +
    "            AND j.type = ?  " +
    "UNION  " +
    " SELECT  " +
    "        '1' AS type, " +
    "            h.friends_seq AS seq, " +
    "            u.name AS name, " +
    "            u.id AS id, " +
    "            u.tag AS tag, " +
    "            j.json AS json " +
    "    FROM " +
    "        hello_friends h, json j, user u " +
    "    WHERE " +
    "        h.friends_seq = j.user_seq " +
    "            AND h.friends_seq = u.seq " +
    "            AND h.user_seq = (SELECT  " +
    "                seq " +
    "            FROM " +
    "                user " +
    "            WHERE " +
    "                id = ?) " +
    "            AND j.type = ?  " +
    "UNION  " +
    " SELECT  " +
    "        '2' AS type, '' AS seq, f.friends_name AS name, f.friends_id AS id, '' AS tag, '' AS json " +
    "    FROM " +
    "        facebook_friends f, user u " +
    "    WHERE " +
    "        f.user_seq = u.seq  " +
    "        AND u.id = ? " +
    "        AND f.friends_id NOT IN (SELECT " +
    "                u.id " +
    "            FROM " +
    "                hello_friends h, user u" +
    "            WHERE " +
    "                h.friends_seq = u.seq)) A " +
    "ORDER BY type " +
    "LIMIT ? , ?";

exports.deleteUserJson = "DELETE FROM json WHERE user_seq = ?";

exports.deleteUserJsonWithType = "DELETE FROM json WHERE user_seq = ? and type = ?";

exports.deleteUserJsonWithTypeAndSubType = "DELETE FROM json WHERE user_seq = ? and type = ? and subtype = ?";

exports.deleteUserJsonWithTypeAndSubTypeAndHeroname = "DELETE FROM json WHERE user_seq = ? and type = ? and subtype = ? and hero_name = ?";

exports.insertUserJson = "INSERT INTO json(`user_seq`, `type`, `subtype`, `hero_name`, `json`, `mod_date`) VALUES (?, ?, ?, ?, ?, NOW());";