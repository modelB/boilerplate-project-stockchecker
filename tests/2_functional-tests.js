const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const app = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("gets stock data for a single stock", (done) => {
    chai
      .request(app)
      .get("/api/stock-prices?stock=GOOG")
      .end((err, res) => {
        assert.equal(res.body.stockData.stock, "GOOG");
        done();
      });
  });

  test("likes a single stock", (done) => {
    chai
      .request(app)
      .get("/api/stock-prices?stock=META&like=true")
      .end((err, res) => {
        const likes = res.body.stockData.likes;
        assert.isAbove(likes, 0);
        done();
      });
  });
  test("only accepts a single like per IP address", (done) => {
    chai
      .request(app)
      .get("/api/stock-prices?stock=TWTR&like=true")
      .end((err, res) => {
        const likes = res.body.stockData.likes;
        chai
          .request(app)
          .get("/api/stock-prices?stock=TWTR&like=true")
          .end((err, res) => {
            assert.equal(res.body.stockData.likes, likes);
            done();
          });
      });
  });

  test("gets stock data for two stocks", (done) => {
    chai
      .request(app)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT")
      .end((err, res) => {
        assert.equal(res.body.stockData.length, 2);
        done();
      });
  });

  test("gets stock data for two stocks and liking them", (done) => {
    chai
      .request(app)
      .get("/api/stock-prices?stock=GOOG&stock=MSFT&like=true")
      .end((err, res) => {
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
      });
  });
});
