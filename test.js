describe("isGameOver", function() {

    it("проверяет массив ходов игрока", function() {
        assert.equal(isGameOver([1,2,3]), true);
    });

    it("проверяет массив ходов игрока", function() {
        assert.equal(isGameOver([4,1,6,5]), true);
    });

    it("проверяет массив ходов игрока", function() {
        assert.equal(isGameOver([1,2,7]), false);
    });

    it("проверяет массив ходов игрока", function() {
        assert.equal(isGameOver([5,4,3]), false);
    });

    it("проверяет массив ходов игрока", function() {
        assert.equal(isGameOver([1,2,7,6]), false);
    });

});