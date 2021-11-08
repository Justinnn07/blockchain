pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmmount,
        address author
    );
    constructor() public {
        name = "Justin's Social Network";
    } 
    function createPost(string memory _content) public {
       // Require Valid content
        require(bytes(_content).length > 0);
       // increment the post count 
        postCount ++;
       // create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
       // Trigger Event
        emit PostCreated(postCount, _content, 0, msg.sender);
    }
}

