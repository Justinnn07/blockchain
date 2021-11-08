pragma solidity ^0.5.0;


contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmmount,
        address payable author
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmmount,
        address payable author
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
    function TipPost(uint _id) public  payable {
        // fetch the post 
        Post memory _post = posts[_id];
        // fetch the author 
        address payable _author = _post.author;
        // pay the author 
        address(_author).transfer(msg.value);
        // increment the tip 
        _post.tipAmount = _post.tipAmount + msg.value;
        // update the post 
         posts[_id]  = _post;
        // Trigger an  event 
        emit PostTipped(postCount, _post.content, _post.tipAmount, _post.author);
    }
}

