<template>
  <v-col align-self="start" class="ma-0 pa-4">
    <p class="ma-0 mb-1 pa-0 grey--text text--darken-2">Добавить промокод</p>
    <v-row class="mx-0" align="center">
      <v-text-field v-model="code" class="code-input" label="Промокод"></v-text-field>
      <v-text-field class="ml-3" v-model="subscription_duration" label="Длительность подписки"></v-text-field>
      <v-select class="ml-3" label="Пакет" :items="plans.map(e => e.name)" v-model="plan"></v-select>
      <v-checkbox class="ml-3" label="Многразовый" v-model="infinite"></v-checkbox>
    </v-row>
    <v-btn :disabled="!validate" class="mb-2 white--text" depressed color="blue" block @click="addCode">Создать
    </v-btn>
    <v-row class="mx-0" align="end">
      <p class="ma-0 mb-1 pa-0 grey--text text--darken-2">Действующие промокоды</p>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-row>

    <v-data-table :search="search" :items="codes"
                  :headers="headers" hide-default-footer>

      <template v-slot:no-data>
        Список промокодов пуст
      </template>
      <template v-slot:no-results>
        Нет найденных промокодов
      </template>

      <template v-slot:item.infinite="{ item }">
        <v-icon>mdi-{{!item.infinite ? "minus-box" : "checkbox-marked"}}</v-icon>
      </template>

      <template v-slot:item.plan_id="{ item }">
        {{plans.filter(e => e.id == item.plan_id)[0].name}}
      </template>

      <template v-slot:item.date="{ item }">
        {{convertDate(item.date).date}}
      </template>

      <template v-slot:item.action="{ item }">
        <template>
          <v-icon color="error" @click="deleteCode(item)">
            mdi-delete-forever
          </v-icon>
        </template>
      </template>
    </v-data-table>
  </v-col>
</template>

<script>
  import dateFuncs from "../mixins/dateFuncs";

  export default {
    mixins: [dateFuncs],
    middleware: "protectRole",
    data() {
      return {
        code: "",
        subscription_duration: 31,
        infinite: false,
        plan: null,
        codes: [],
        plans: [],
        search: "",
        headers: [
          {
            text: "Код",
            align: "left",
            sortable: true,
            value: "key"
          },
          {
            text: "Многоразовый",
            align: "left",
            sortable: true,
            value: "infinite"
          },
          {
            text: "Длительность подписки",
            align: "left",
            sortable: true,
            value: "subscription_duration"
          },
          {
            text: "Пакет",
            align: "left",
            sortable: true,
            value: "plan_id"
          },
          {
            text: "Дата создания",
            align: "left",
            sortable: true,
            value: "date"
          },
          {
            text: "Действия",
            align: "center",
            sortable: false,
            value: "action"
          }
        ]
      };
    },
    methods: {
      async addCode() {
        if (this.validate) {
          const data = {
            key: this.code,
            infinite: this.infinite,
            plan_id: this.plans.filter(e => e.name === this.plan)[0].id,
            subscription_duration: this.subscription_duration
          };
          try {
            const r = await this.$api.Promo.create(data);
            if (r.success) {
              this.codes = [...this.codes, r.data];
              this.code = "";
              this.infinite = false;
              this.plan = null;
            }
            this.$notifier.showMessage({ message: "Промокод успешно создан" });
          } catch (e) {

          }
        }
      },
      async deleteCode(item) {
        let r = confirm(`Вы действительно хотите удалить промокод?`);
        if (r === true) {
          try {
            const r = await this.$api.Promo.remove({ id: item.id });
            if (r.success) {
              this.codes = this.codes.filter(e => e.id !== item.id);
            }
          } catch
            (e) {
          }
        }
      }
    },
    computed: {
      validate() {
        return this.code && this.plan;
      }
    },
    async asyncData(ctx) {
      try {
        const { data } = await ctx.app.$api.Promo.get();
        return { codes: data.codes, plans: data.plans };
      } catch (e) {
        ctx.app.$notifier.showMessage({ type: "error", message: "Ошибка загрузки данных" });
      }
    }
  };
</script>

