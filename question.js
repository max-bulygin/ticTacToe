var model = {
    firstPlayerTurn: true
};

var view = {
    statsContainer: 'some elements',
    init: function () {
        this.d = this.toggleActive();
        this.d();
    },
    toggleActive: function () {
        var el;
        return function () {
            if(el) el.classList.remove('active');

            el = model.firstPlayerTurn ? this.statsContainer[0] : this.statsContainer[1];
            el.classList.add('active');
        };
    }
};