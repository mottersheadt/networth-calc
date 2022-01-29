<template>
  <div class="mt-5">
    <h1>Home</h1>
    
    <div class="row">
      <div class="col">
        <input v-model="startDate" type="date" class="form-control" placeholder="Start Date" aria-label="Start Date">
      </div>
      <div class="col">
        <input v-model="endDate" type="date" class="form-control" placeholder="End Date" aria-label="End Date">
      </div>
    </div>
    <div class="row mt-3">
      <div class="col">
        <button class="btn btn-primary" @click="submit">load data</button>
        <button class="btn btn-warning ml-2" @click="reset">reset data</button>
      </div>
    </div>
    <div class="mt-3">
      <div class="bg-light p-3">
        {{response}}
      </div>
    </div>

    <ul class="mt-5">
      <li v-for="company in companies" :key="company.id">
        {{ company.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['category'],
    async created() {
      const transactions = await this.methods.loadRates();
      const transactions = await this.methods.loadTransactions();
      this.netWorth = this.methods.calculate(transactions);
    },
    
    data() {  
      return {
        startDate: null,
        endDate: null
      }
    },

    methods: {
      async loadRates()
      {
        this.rates = await this.$config.ratesEP
      },
      async loadTransactions()
      {
        var data = [{
            "createdAt": "2020-04-20T15:49:57.741Z",
            "amount": 100,
            "currency": "CAD",
            "type": "external account",
            "direction": "credit",
            "from": {
            }
        },
        {
            "createdAt": "2020-04-09T18:31:25.776Z",
            "amount": 495,
            "currency": "CAD",
            "type": "external account",
            "direction": "credit",
            "from": {
            }
        },
        {
            "createdAt": "2020-04-06T20:34:32.796Z",
            "amount": 0.002,
            "currency": "BTC",
            "type": "external account",
            "direction": "debit",
            "to": {
                "toAddress": "btc:2N2DZtj1SfcGkaeHA72eZAYBrFbyMZoHVmE"
            }
        },
        {
            "createdAt": "2020-03-16T18:30:59.575Z",
            "amount": 0.01,
            "currency": "BTC",
            "type": "peer",
            "direction": "credit",
            "from": {
            }
        },]
        return data;
      },

      calculate(transactions)
      {
        let networth = {
          "BTC": 0,
          "ETH": 0,
          "CAD": 0,
          "total": 0
        };
        
        for(let i = 0; i < transactions.length; i++)
        {
          var transaction =  transactions[i];
          networth[transaction.currency] = transaction.direction == "debit"
            ? networth[transaction.currency] + (transaction.amount * )
        }
      },

      async submit(event) {
        console.log(event);
        let resp = await axios.post(`${this.$config.apiUrl}/submit?name=tester`, {
          card_cvc: "123",
          account_number: "234522134",
          ssn: "1234",
          card_number: "16661",
          startDate: this.startDate,
          endDate: this.endDate,
        });
        console.log(resp)
        this.response = resp.data
      },

      reset() {
        this.response = null
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
