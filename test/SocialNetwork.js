const { assert } = require("chai");
const SocialNetwork = artifacts.require("SocialNetwork");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await socialNetwork.name();
      assert.equal(name, "Justin's Social Network");
    });

    describe("posts", async () => {
      let result, postCount;

      before(async () => {
        result = await socialNetwork.createPost("This is my first post", {
          from: author,
        });
        postCount = await socialNetwork.postCount();
      });
      it("creates posts", async () => {
        // SUCCESS
        assert.equal(postCount, 1);
        const event = result.logs[0].args;
        assert.equal(
          event.id.toNumber(),
          postCount.toNumber(),
          "id is correct"
        );
        assert.equal(
          event.content,
          "This is my first post",
          "content is correct"
        );
        assert.equal(event.tipAmmount, "0", "tip amount is correct");
        assert.equal(event.author, author, "author is correct");

        // FAIL
        await socialNetwork.createPost("", {
          from: author,
        }).should.be.rejected;
      });

      it("list posts", async () => {
        const posts = await socialNetwork.posts(postCount);
        assert.equal(
          posts.id.toNumber(),
          postCount.toNumber(),
          "id is correct"
        );
        assert.equal(
          posts.content,
          "This is my first post",
          "content is correct"
        );
        assert.equal(posts.tipAmount, "0", "tip amount is correct");
        assert.equal(posts.author, author, "author is correct");
      });
      it("allows users to tip posts", async () => {
        result = await socialNetwork.tipPost(postCount, {
          from: tipper,
          value: web3,
        });
        assert.equal(postCount, 1);
        const event = result.logs[0].args;
        assert.equal(
          event.id.toNumber(),
          postCount.toNumber(),
          "id is correct"
        );
        assert.equal(
          event.content,
          "This is my first post",
          "content is correct"
        );
        assert.equal(
          event.tipAmmount,
          "1000000000000000000",
          "tip amount is correct"
        );
        assert.equal(event.author, author, "author is correct");
      });
    });
  });
});
