"use strict";

var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;
var badvotes = 0;

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    createUser(user) {
        /*
        first we have to hash the password. we will learn about hashing next week.
        the goal of hashing is to store a digested version of the password from which
        it is infeasible to recover the original password, but which can still be used
        to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
            .then(hashedPassword => {
                return this.conn.query('INSERT INTO users (username,password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', 
                [user.username, hashedPassword]);
            })
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A user with this username already exists');
                }
                else {
                    throw error;
                }
            });
    }

    createPost(post) {
        
        if(!post.subredditId){
            throw new Error('Missing subredditId');
            
            
        }
        else{
        return this.conn.query(
            `
            INSERT INTO posts (userId, title, url, subredditId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?,NOW(), NOW())`,
            [post.userId, post.title, post.url,post.subredditId]
        )
            .then(result => {
                return result.insertId;
            });
    }
    }
        createSubreddit(subreddit) {
        return this.conn.query(
            `
            INSERT INTO subreddits (name,description, createdAt, updatedAt)
            VALUES (?, ?,NOW(), NOW())`,
            [subreddit.name, subreddit.description]
        )
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A subreddit with this name already exists');
                }
                else {
                    throw error;
                }
            });
    }

    getAllPosts() {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
        return this.conn.query(
            
           
        //     SELECT posts.id, posts.title, posts.url, posts.createdAt, posts.updatedAt, posts.userId, users.username, users.createdAt as userCreated, users.updatedAt as userUpdated,subreddits.name as subredditName, subreddits.description as subredditDesc, subreddits.createdAt as subCreated, subreddits.updatedAt as subUpdated
        //     FROM posts
        //     LEFT JOIN users ON posts.userId = users.id
        //     LEFT JOIN subreddits ON posts.subredditId = subreddits.id;
            
        
        
       `SELECT posts.id, SUM(votes.voteDirection) as voteScore,posts.title, posts.url,  posts.createdAt, posts.updatedAt,  posts.userId,  users.username,  users.createdAt as userCreated,  users.updatedAt as userUpdated, subreddits.name as subredditName, subreddits.description as subredditDesc, subreddits.createdAt as subCreated, subreddits.updatedAt as subUpdated, votes.voteDirection as voteDirection  FROM posts LEFT JOIN users ON posts.userId = users.id LEFT JOIN subreddits ON posts.subredditId = subreddits.id LEFT JOIN votes ON posts.id = votes.postId GROUP BY posts.id ORDER BY voteScore DESC,posts.createdAt DESC;`
    );
        
    }
    
    getAllSubreddits() {
       
        return this.conn.query(
            `
            SELECT subreddits.id, subreddits.name, subreddits.description, subreddits.createdAt, subreddits.updatedAt
            FROM subreddits
            ORDER BY createdAt DESC`
        );
    }

    createVote(vote){
        
        if (vote.voteDirection == 1 || vote.voteDirection == 0 || vote.voteDirection == -1)
{
    //print address book    

        
        return this.conn.query(
            `INSERT INTO votes SET postId=?, userId=?, voteDirection=? ON DUPLICATE KEY UPDATE voteDirection=?;`,
            [vote.postId, vote.userId, vote.voteDirection, vote.voteDirection]
            )
            .then(result => {
                return result.insertId;
            });
            
}
else{
    return this.conn.query(
            `describe votes;`
            )
            .then(result => {
                return result.insertId;
            });
}
            }
            



createComment(comment){

  
        return this.conn.query(
            `
            INSERT INTO comments (text,userId, postId, parentId,createdAt, updatedAt)
            VALUES (?,?,?,?,NOW(), NOW())`,
            [comment.text,comment.userId,comment.postId,comment.parentId]
        )
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                //if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A comments table insertion error here');
                // }
                // else {
                //     throw error;
                // }
            });
    

}



getAllTopLevelComments(fff,g) {
       
    return this.conn.query(
            `
            SELECT *
            FROM comments
            WHERE comments.postId = ?`,
            [fff.postId]
        );
    }

createReply(reply){

  
        return this.conn.query(
            `
            INSERT INTO replies (commentId,level,text,createdAt, updatedAt)
            VALUES (?,?,?,?,?)`,
            [reply.commentId,reply.level,reply.text,reply.createdAt,reply.updatedAt]
        )
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                //if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A comments table insertion error here');
                // }
                // else {
                //     throw error;
                // }
            });
    

}






// checkNull(ggg){
    
//     if (ggg['parentId'] == null){
        
//         goget(ggg.id,n-1);
        
//     }
// }
    
// goget(arrObj,someid, n){
    
//     if (n==0){
//         return;
//     }
    
//     else if (arrObj['someid'] == arrObj['parentId'])
//     {
//     // write it out
    
//     var newParent = arrObj['parentId']
    
//     goget(arrObj,newParent, n-1);
    
//     }
//     else{
//     arr++;
    
//     goget(arr, n-1)
    
//     }
// }
    


// forEach  
//  if (data.parentId = check)
//   check = data.parentId;
            // var replyarray ={
            //     id = zzz.id,
            //     text=zzz.text,
            //     createdAt=zzz.createdAt,
            //     updatedAt=zzz.updatedAt
            // }
    




//     call recur




    
//     if (data.parentId == null)
        
//         getFunction (bigarray,data.comments.id, levels-1)
        
//             if     
    
    
    
// function recur(commentid,levels){
    
//     if (levels = 0){
//         return
//     }
//     else if (commentid = data.parentid){
//         //write to list
//         recur(data.parentid, levels-1)
        
//     }
// }
    
    
// getChildComments(data){
    
//     //forEach object here add a replies object
    
//     if(data.tlc.parentId == null )
            
//             {
//                 getNextChild(data.tlc.comments.id)
                
//             }
            
    
            



    
//     return this.conn.query(
        
//          `
//             SELECT comments.id, comments.userId,comments.postId,comments.parentId,comments.text,comments.createdAt,comments.updatedAt
//             FROM comments
//             WHERE comments.postId = ? AND comments.parentId IS NULL ORDER BY createdAt DESC`,
//             [fff.postId]
        
//         )
    
// }
    
    
}

module.exports = RedditAPI;