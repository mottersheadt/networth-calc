<template>
  <div class="mt-5">
    <h1>Networth</h1>
    
    <div class="mt-3">
      <div class="bg-light p-3">
        The chart below shows how the networth changed over time. Hover your mouse over the chart to see details on each change. Use the Start Date and End Date to limit the results in the chart.
      </div>
    </div>    
    
    <div class="row">
      <div class="col">
        <label>Start Date</label>
        <input v-model="startDate" type="date" class="form-control" placeholder="Start Date" aria-label="Start Date">
      </div>
      <div class="col">
        <label>End Date</label>
        <input v-model="endDate" type="date" class="form-control" placeholder="End Date" aria-label="End Date">
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <button class="btn btn-primary" @click="update">Update</button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        Max Amount: {{netWorth.max}}
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        End Amount: {{netWorth.total}}
      </div>
    </div>

    <div class="row mt-3">
      <div class="history">
        <div v-for="(item) in netWorth.history" :key="item.id" class="history-item"
            v-bind:style="{
              width: 99.5 /  transactionCount + '%'}">
          <div class="history-bar"
            v-bind:style="{
              height:  item.amount / netWorth.max * 100 + '%'}">
          </div>
            <div class="history-hover">
              Date: {{item.date}}
              <br>
              Amount: {{item.amount}}
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    async created() {
      this.update();
    },
    
    data() {  
      return {
        chartdata: {
          labels: ['January', 'February'],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [40, 20]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        },
        startDate: null,
        endDate: null,
        netWorth: {
          "BTC": {
            amount: 0,
          },
          "ETH": {
            amount: 0,
          },
          "CAD": {
            amount: 0,
          },
          "total": 0,
          "max": 0,
          history: [
          ]
        }
      }
    },

    methods: {
      async update()
      {
        this.netWorth =  {
          "BTC": {
            amount: 0,
          },
          "ETH": {
            amount: 0,
          },
          "CAD": {
            amount: 0,
          },
          "total": 0,
          "max": 0,
          history: [
          ]
        }
        const transactions = await this.loadTransactions();
        this.calculate(transactions, this.$config.rates);
        console.log("Networth", this.netWorth);
      },

      async loadTransactions()
      {
        var response = await axios.get(this.$config.transactionHistoryEP);
        console.log("Transactions", response.data, response);
        return response.data.reverse();
      },
      calculate(transactions, rates)
      {
        console.log("start date", this.startDate);
        console.log("end date", this.endDate);
        let netWorth = this.netWorth;
        console.log("Start NetWorth", netWorth)

        for(let i = 0; i < transactions.length; i++)
        {
          var transaction =  transactions[i];
          if(!!this.startDate && new Date(this.startDate) > Date.parse(transaction.createdAt))
            continue;
          if(!!this.endDate && new Date(this.endDate) < Date.parse(transaction.createdAt))
            break;

          this.calculateTranasction(transaction,  netWorth);

          netWorth.total = netWorth.BTC.amount * rates[`BTC_CAD`] + netWorth.ETH.amount * rates[`ETH_CAD`] + netWorth.CAD.amount;

          if(netWorth.total > netWorth.max)
            netWorth.max = netWorth.total;

          netWorth.history.push({
            id: i,
            amount: netWorth.total,
            date: transaction.createdAt
          })
        }
        this.transactionCount = netWorth.history.length
      },

      calculateTranasction(transaction, netWorth)
      {
          // console.log("Calculating", transaction.createdAt, transaction.amount)
          if(transaction.direction == "debit")
          {
            netWorth[transaction.currency].amount = netWorth[transaction.currency].amount - transaction.amount;
          }
          else if(transaction.direction == "credit")
          {
            netWorth[transaction.currency].amount = netWorth[transaction.currency].amount + transaction.amount;
          }
          else if(transaction.type == "conversion")
          {
            netWorth[transaction.from.currency].amount -= transaction.from.amount;
            netWorth[transaction.to.currency].amount += transaction.to.amount;
          }
          else {
            console.error("Unhandled transaction type for transaction", transaction)
          }
      },

      reset() {
        this.response = null
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.history {
  height: 500px;
}
.history-item {
  display: inline-block;
  height: 100%;
  position: relative;
}

.history-bar{
  background: rgb(85, 85, 204);
}

.history-item:hover {
  z-index: 99;
}

.history-item .history-hover {
  display: none;
}

.history-bar{
  background: rgb(85, 85, 204);
}

.history-item:hover .history-bar
{
  background: black
}

.history-item:hover .history-hover {
  display: inline-block;
  position: absolute;
  top: 30px;
  left: 0;
  width: 300px;
  height: 60px;
  background: black;
  color: white;
  z-index: 100;
}
</style>
