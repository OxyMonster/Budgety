
//************** */ BUDGET CONTROLLER *************************** 
var budgetController = (function (){

    var Expense = function (id, desctirpion, value){

        this.id = id;
        this.desctirpion = desctirpion;
        this.value = value;
        this.percentage = -1;
    };
   
    Expense.prototype.caclPercentage = function (totalIncome){

        if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function (){
        return this.percentage;
    }
    var Income = function (id, desctirpion, value){

        this.id = id;
        this.desctirpion = desctirpion;
        this.value = value;
    };

    var calculateTotal = function (type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
        
    };

    var data  = {
    allItems : {
        inc: [],
        exp: []
    },
    totals : {
        exp : 0,
        inc : 0
    },
    budget : 0,
    percentage: - 1
};

return {
    addItem: function (type, des, val) {
       var newItem, ID;

       
        // Create new ID 
        if (data.allItems[type].length > 0){

            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        }else {
            ID = 0;
        }
       
       
       // Create new item Based on Income or Expense 
       if (type === 'exp'){
        newItem = new Expense (ID, des, val);
       }else if (type === 'inc'){
        newItem = new Income (ID, des, val);
       }
      
       // Push newItem to the Data
       data.allItems[type].push(newItem);
       
       return newItem;
       
    },


    deleteItem : function(type, id) {
        var ids, index;
        
        
        
        ids = data.allItems[type].map(function(current) {
            return current.id;
        });

        index = ids.indexOf(id);

        if (index !== -1) {
            data.allItems[type].splice(index, 1);
        }
        
    },



    calculateBudget: function (){

        // calculate total income and expenses

        calculateTotal ('exp');
        calculateTotal ('inc');

        // Calculate the budget: income - Expense

        data.budget = data.totals.inc - data.totals.exp;


        // Calculate the percentage 

        if (data.totals.inc > 0){
            
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else {
            data.percentage = -1;
        }
        
    },

    calculatePercentages: function () {
      
        data.allItems.exp.forEach(function(cur) {
            cur.caclPercentage(data.totals.inc);
        });
    },

    getPercentages: function () {

        var allPerc = data.allItems.exp.map(function(cur){

            return cur.getPercentage();
        });
        return allPerc;
    },

    getBudget: function() {
        return {
            budget: data.budget,
            percentage: data.percentage,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp
        }

    },

    
    testing: function () {
    console.log (data);
    }

};

})();



//******************* */ USER INTERFACE CONTROLLER ****************
var UIController = (function (){

    var DOMstrinngs = {
        inputType: '.add__type',
        inputDesctiption: '.add__description',
        inputValue: '.add__value',
        inputBTN: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel:'.item__percentage',
        dateLabel: '.budget__title--month'
    };

    formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
            
        int = numSplit[0];

        if (int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];


        return   (type === 'exp' ?  '-' :  '+' ) + ' ' + int + '.' + dec;

        };
        
        var nodeListForEach = function(list, callback) {
            for (var i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        };
    
    return {
        getIpnut : function (){
            return {
                            
             type : document.querySelector(DOMstrinngs.inputType).value,      // INCOME  EITHER  EXPENSE 
             desctirpion : document.querySelector (DOMstrinngs.inputDesctiption).value,
             value : parseFloat ( document.querySelector (DOMstrinngs.inputValue).value)
            };
        },

        addListItem : function (obj, type){

            var html, newHtml, element;

            if (type === 'inc'){
                element = DOMstrinngs.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desctirpion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> '
            }else if (type === 'exp'){
                element = DOMstrinngs.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desctirpion%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            // Replace the placeHolder text with data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desctirpion%', obj.desctirpion);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));


            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },


        getDOMstrings: function (){
            return DOMstrinngs;
        },

        deleteListItem : function (seletcorID){

            var el = document.getElementById(seletcorID);
            el.parentNode.removeChild(el);

        },

        
        clearFields : function () {

            var  fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrinngs.inputDesctiption + ', ' + DOMstrinngs.inputValue);

           var fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current, index, array) {

            current.value = '';
           });

           fieldsArr[0].focus();
        },

        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrinngs.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },


        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstrinngs.inputType + ',' +
                DOMstrinngs.inputDesctiption + ',' +
                DOMstrinngs.inputValue);
        
        
                nodeListForEach(fields, function(cur) {

                    cur.classList.toggle('red-focus');

                });
                document.querySelector(DOMstrinngs.inputBTN).classList.toggle('red');
            },
        
        
        displayBudget: function (obj){

            var type;
            obj.budget  > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector (DOMstrinngs.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector (DOMstrinngs.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector (DOMstrinngs.expensesLabel).textContent =formatNumber(obj.totalExp, 'exp');
            

            if (obj.percentage > 0){
                document.querySelector (DOMstrinngs.percentageLabel).textContent = obj.percentage + '%';
            }else {
                document.querySelector (DOMstrinngs.percentageLabel).textContent = '---';
            }
        },

        displayMonth: function(){

            var now, year,months, month;

            now = new Date();
            //var christmans = new Date(2019, 11, 25);

            months = ['January','February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrinngs.dateLabel).textContent = months[month] + ' ' + year;

        },

    };

})();



//********************  GLOBAL APP CONTROLLER ************************
var AppController = (function (budgetCtrl, UICtrl){
 
    var setupEvenetListeners = function (){

        var DOM  = UIController.getDOMstrings ();
        
        document.querySelector(DOM.inputBTN).addEventListener('click', ctrlAddItem);
        
        addEventListener('keypress', function (e){

            if (e.keyCode === 13 || e.which === 13){
                ctrlAddItem ();               
    }    
}); 

document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

document.querySelector(DOM.inputType).addEventListener('change', UIController.changeType);
};

var updatePercentages = function (){

    // 1. Calculate percentages

    budgetController.calculatePercentages();
    
    //2. Read percentages from the budgetCTRL

    var percentages = budgetController.getPercentages()
    
    //3. Update UI with new percentages 
    UIController.displayPercentages(percentages);

};
    


var updateBudget = function () {
    // 1. Calculate budget;
    budgetController.calculateBudget();
    
    // 2. Return budget 
    var budget = budgetController.getBudget();
   
    // 3. Display budghet on the UI - UserInterface
    UICtrl.displayBudget(budget);
    
};
     
  var ctrlAddItem  = function (){
      var input, newItem;
      
      // 1. Get the field input data 
      var input =  UIController.getIpnut();

      if (input.desctirpion !== '' && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller 
      var newItem = budgetController.addItem(input.type, input.desctirpion, input.value);
      
      // 3. Add the item tothe UI 
      UIController.addListItem(newItem, input.type);
     
      // 4. CLear the fields 
      UIController.clearFields();
      
      // 5. Calculate and update the Budget
      updateBudget();

      // 6. Calculate and  uptade percentages 

      updatePercentages();

      }
    
}; 

var ctrlDeleteItem = function (event){
    var itemID, splitID, type, ID;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID){

        // inc-1
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        
        // 1. Delete item frtom the data 
        budgetCtrl.deleteItem(type, ID);

        // 2. Delete the item from the UI

        UICtrl.deleteListItem(itemID);
        // 3. Update and show new budget 

        updateBudget();

        // 4. Calculate and update new percentages

        updatePercentages();

    }
};
return {
    init: function (){
        
        setupEvenetListeners();
        UIController.displayMonth();
        UIController.displayBudget({
            budget : 0,
            percentage: -1,
            totalInc : 0,
            totalExp : 0
        });

    }
};


})(budgetController, UIController);



AppController.init();
