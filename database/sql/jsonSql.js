// 친구 목록의 총개수를 조회합니다.
exports.getFriendsAttributesListTotalCount = "SELECT \n" +
    "    COUNT(*) AS cnt\n" +
    "FROM\n" +
    "    (SELECT \n" +
    "        u.seq AS seq\n" +
    "    FROM\n" +
    "        user u, json j\n" +
    "    WHERE\n" +
    "        u.tag = j.tag AND u.id = ?\n" +
    "            AND j.type = ?\n" +
    "    GROUP BY u.seq \n" +
    "    UNION \n" +
    "    SELECT \n" +
    "        h.user_seq AS seq\n" +
    "    FROM\n" +
    "        hello_friends h, user u, json j\n" +
    "    WHERE\n" +
    "        h.friends_seq = u.seq AND u.tag = j.tag\n" +
    "            AND u.id = ?\n" +
    "            AND j.type = ?\n" +
    "    GROUP BY h.user_seq) A";

// 친구 목록을 조회합니다.
exports.getFriendsAttributesList = "SELECT \n" +
    "    A.*\n" +
    "FROM\n" +
    "    (SELECT \n" +
    "        '0' AS type,\n" +
    "            u.seq AS seq,\n" +
    "            u.name AS name,\n" +
    "            u.id AS id,\n" +
    "            u.tag AS tag,\n" +
    "            j.json AS json\n" +
    "    FROM\n" +
    "        user u, json j\n" +
    "    WHERE\n" +
    "        u.tag = j.tag\n" +
    "            AND u.id = ? \n" +
    "            AND j.type = ? UNION SELECT \n" +
    "        '1' AS type,\n" +
    "            h.friends_seq AS seq,\n" +
    "            u.name AS name,\n" +
    "            u.id AS id,\n" +
    "            u.tag AS tag,\n" +
    "            j.json AS json\n" +
    "    FROM\n" +
    "        hello_friends h, user u, json j\n" +
    "    WHERE\n" +
    "        h.friends_seq = u.seq AND u.tag = j.tag\n" +
    "            AND u.id = ? \n" +
    "            AND j.type = ?) A\n" +
    "ORDER BY type\n" +
    "LIMIT ? , ?";

// 삭제합니다.
exports.deleteUserJson = "DELETE FROM json WHERE tag = ?";

// 타입별로 삭제합니다.
exports.deleteUserJsonWithType = "DELETE FROM json WHERE tag = ? and type = ?";

// 타입 및 서브타입별로 삭제합니다.
exports.deleteUserJsonWithTypeAndSubType = "DELETE FROM json WHERE tag = ? and type = ? and subtype = ?";

// 타입, 서브타입, 히어로명별로 삭제합니다.
exports.deleteUserJsonWithTypeAndSubTypeAndHeroname = "DELETE FROM json WHERE tag = ? and type = ? and subtype = ? and hero_name = ?";

// 데이터를 등록합니다.
exports.insertUserJson = "INSERT INTO json(`tag`, `type`, `subtype`, `hero_name`, `json`, `mod_date`) VALUES (?, ?, ?, ?, ?, NOW())";

// 업데이트 대상(업데이트 한 뒤 한 시간 경과된 태그 목록) 조회
exports.selectTagListForUpdate = "SELECT \n" +
    "    A.*\n" +
    "FROM\n" +
    "    (SELECT \n" +
    "        u.tag AS tag,\n" +
    "            MAX(j.mod_date) AS modDate,\n" +
    "            p.name AS platformName,\n" +
    "            r.name AS regionName\n" +
    "    FROM\n" +
    "        user u\n" +
    "    LEFT OUTER JOIN json j ON u.tag = j.tag AND j.type = ?\n" +
    "    LEFT OUTER JOIN platform p ON u.platform_seq = p.seq\n" +
    "    LEFT OUTER JOIN region r ON u.region_seq = r.seq\n" +
    "    WHERE\n" +
    "        u.del_yn = 'N' and (? = '' or u.id = ?)\n" +
    "    GROUP BY u.tag , j.tag, p.name, r.name) A\n" +
    "WHERE\n" +
    "    A.modDate IS NULL\n" +
    "        OR A.modDate < DATE_ADD(NOW(), INTERVAL - 3 HOUR)";

exports.selectAllHeroList = "SELECT \n" +
    "    A.*\n" +
    "FROM\n" +
    "    (SELECT \n" +
    "        u.tag AS tag,\n" +
    "            j.subtype AS subtype,\n" +
    "            j.json AS json,\n" +
    "            MAX(j.mod_date) AS modDate,\n" +
    "            p.name AS platformName,\n" +
    "            r.name AS regionName\n" +
    "    FROM\n" +
    "        user u\n" +
    "    LEFT OUTER JOIN json j ON u.tag = j.tag AND j.type = 3\n" +
    "    LEFT OUTER JOIN platform p ON u.platform_seq = p.seq\n" +
    "    LEFT OUTER JOIN region r ON u.region_seq = r.seq\n" +
    "    WHERE\n" +
    "        u.del_yn = 'N' and (? = '' or u.id = ?) \n" +
    "    GROUP BY u.tag , j.tag, j.json, j.subtype, p.name, r.name) A\n" +
    "WHERE\n" +
    "    A.modDate IS NULL\n" +
    "        OR A.modDate < DATE_ADD(NOW(), INTERVAL - 3 HOUR)";