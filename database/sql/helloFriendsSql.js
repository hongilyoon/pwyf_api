exports.insertHelloFriendsList = "INSERT INTO  hello_friends(user_seq, friends_seq)  "+
            "SELECT       "+
            " f.user_seq, u.seq  "+
            "FROM      "+
            " facebook_friends f          "+
            "    INNER JOIN      "+
            "    user u ON f.friends_id = u.id  "+
            "WHERE      "+
            " u.seq NOT IN ( "+
            "  SELECT "+
            "   friends_seq          "+
            "  FROM              "+
            "   hello_friends          "+
            "  WHERE              "+
            "   user_seq = f.user_seq)"