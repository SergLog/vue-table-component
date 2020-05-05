<template>
  <div class="mytable">
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      style="display: none"
    ></b-pagination>

    <div class="title">Table UI</div>
    <!-- control panel section -->
    <b-row>
      <b-col cols="7">
        <div class="sortBtns">
          <div class="sortBy">Sorting by:</div>
          <b-button variant="success" @click="chooseColumn('product')">Product (100g serving)</b-button>
          <b-button variant="transparent" @click="chooseColumn('calories')">Calories</b-button>
          <b-button variant="transparent" @click="chooseColumn('fat')">Fat (g)</b-button>
          <b-button variant="transparent" @click="chooseColumn('carbs')">Carbs (g)</b-button>
          <b-button variant="transparent" @click="chooseColumn('protein')">Protein (g)</b-button>
          <b-button variant="transparent" @click="chooseColumn('iron')">Iron (%)</b-button>
        </div>
      </b-col>
      <b-col>
        <div class="control-panel">
          <b-button
            :disabled="selectedCheckBoxesCnt == 0 ? true : false"
            :variant="selectedCheckBoxesCnt == 0 ? 'outline-secondary' : 'success'"
            size="sm"
            @click="deleteItems"
          >Delete {{ selectedItemsCnt }}</b-button>
          <b-select
            variant="transparent"
            style="width:109px"
            size="sm"
            v-model="selectedPerPageItem"
            :options="pageOption"
            @change="UpdatePerPage(selectedPerPageItem)"
          ></b-select>
          <b-button class="btn-prev" size="sm" :disabled="currentPage == 1" @click="prevPage"></b-button>
          <div>&nbsp;{{ curentPageCntStart}} - {{ curentPageCntEnd }} of {{ itemsCnt}}&nbsp;</div>

          <b-button
            class="btn-next"
            size="sm"
            :disabled="currentPage == (itemsCnt - 1)"
            @click="nextPage"
          ></b-button>
          <div class="dropdown">
            <b-button
              class="btn-selected-columns"
              variant="outline-secondary"
              size="sm"
              @click="openColumnsOptions"
            >{{ selectedColumnsCnt}} columns selected</b-button>
            <div id="myDropdown" class="dropdown-content">
              <ul>
                <li>
                  <input
                    class="custom-checkbox"
                    type="checkbox"
                    id="all"
                    value="all"
                    v-model="selectedColumns"
                    @click="selectAllColumns"
                  />
                  <label for="all"></label>Select All
                </li>
                <li v-for="item in columnsSettings" :key="item.label">
                  <input
                    class="custom-checkbox"
                    type="checkbox"
                    :id="item.idCol"
                    :value="item.keyCol"
                    v-model="selectedColumns"
                    @click="selectColumns"
                  />
                  <label :for="item.idCol"></label>
                  {{ item.keyCol }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Table section -->
    <b-row>
      <b-table
        id="my-table"
        borderless
        hover
        class="mt-3"
        :per-page="perPage"
        :current-page="currentPage"
        :items="items"
        :fields="fields"
      >
        <template v-slot:cell(id)="data">
          <div class="checkbox">
            <input
              type="checkbox"
              class="custom-checkbox"
              :id="data.item.id"
              :value="data.item.id"
              v-model="selectedCheckboxes"
            />
            <label :for="data.item.id"></label>
          </div>
        </template>
      </b-table>
    </b-row>

    <!-- service message section -->
    <div id="deleteMsg" class="deleteMessage">
      <div class="messageText">
        Are you sure you want
        <b>delete item?</b>
      </div>
      <div class="btnsMessage">
        <b-button variant="outline-secondary" size="sm" @click="cancelDelete">Cancel</b-button>
        <b-button variant="success" size="sm" @click="confirmDelete">Confirm</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteProducts } from "../request.js";

export default {
  name: "TheTable",
  data() {
    return {
      fieldsOrigin: [
        { key: "Id", label: "", order: 1, sortable: false, extra: "Id" },
        {
          key: "product",
          label: "Product (100g serving)",
          order: 2,
          sortable: true,
          extra: "product"
        },
        {
          key: "calories",
          label: "Calories",
          order: 3,
          sortable: false,
          extra: "calories"
        },
        {
          key: "fat",
          label: "Fat (g)",
          order: 3,
          sortable: false,
          extra: "fat"
        },
        {
          key: "carbs",
          label: "Carbs (g)",
          order: 3,
          sortable: false,
          extra: "carbs"
        },
        {
          key: "protein",
          label: "Protein (g)",
          order: 3,
          sortable: false,
          extra: "protein"
        },
        {
          key: "iron",
          label: "Iron (%)",
          order: 3,
          sortable: false,
          extra: "iron"
        }
      ],
      pageOption: [
        { value: 10, text: "10 Per Page" },
        { value: 15, text: "15 Per Page" },
        { value: 20, text: "20 Per Page" }
      ],
      selectedPerPageItem: 10,
      // items: [],
      fields: [],
      selectedCheckboxes: [],
      selectedColumnsOrigin: [
        "all",
        "product",
        "calories",
        "fat",
        "carbs",
        "protein",
        "iron"
      ],
      selectedColumns: [],
      columnsSettings: [
        { idCol: "1col", keyCol: "product" },
        { idCol: "2col", keyCol: "calories" },
        { idCol: "3col", keyCol: "fat" },
        { idCol: "4col", keyCol: "carbs" },
        { idCol: "5col", keyCol: "protein" },
        { idCol: "6col", keyCol: "iron" }
      ],
      perPage: 10,
      currentPage: 1,
      isDisabled: true,
      variant: "outline-secondary"
    };
  },
  computed: {
    rows() {
      return this.items.length;
    },
    selectedColumnsCnt() {
      return this.selectedColumns.filter(el => el != "all").length;
    },
    selectedItemsCnt() {
      let length = this.selectedCheckboxes.length;
      return length !== 0 ? "(" + length + ")" : "";
    },
    selectedCheckBoxesCnt() {
      return this.selectedCheckboxes.length;
    },
    items() {
      return this.$store.state.items;
    },
    itemsCnt() {
      return this.$store.state.items.length;
    },
    curentPageCntStart() {
      return this.perPage * this.currentPage - this.perPage + 1;
    },
    curentPageCntEnd() {
      return this.perPage * this.currentPage;
    }
  },
  created() {
    this.fields = this.fieldsOrigin.slice();

    this.selectedColumns = this.selectedColumnsOrigin.slice();
  },
  methods: {
    cancelDelete() {
      document.getElementById("deleteMsg").classList.remove("show");
    },
    confirmDelete() {
      deleteProducts()
        .then(() => {
          this.selectedCheckboxes.forEach(el => {
            this.$store.commit("deleteItem", el);
          });
          this.selectedCheckboxes = [];
        })
        .catch(error => {
          alert("Не удалось удалить объекты, попробуйте заново!");
          throw error;
        });

      document.getElementById("deleteMsg").classList.remove("show");
    },
    nextPage() {
      this.currentPage++;
    },
    prevPage() {
      this.currentPage--;
    },
    deleteItems() {
      document.getElementById("deleteMsg").classList.toggle("show");
    },
    selectAllColumns() {
      if (event.target.checked) {
        this.selectedColumns = this.selectedColumnsOrigin.slice();

        this.fields.forEach(el => {
          el.key = el.extra;
        });
      }
      if (!event.target.checked) {
        this.selectedColumns = [];

        this.fields.forEach(el => {
          if (el.key != "Id") {
            el.key = "";
          }
        });
      }
    },
    selectColumns() {
      let column = this.fields.find(item => item.extra == event.target.value);

      if (event.target.checked) {
        column.key = event.target.value;

        if (this.selectedColumns.filter(el => el != "all").length == "5") {
          document.getElementById("all").checked = true;
        }
      }

      if (!event.target.checked) {
        column.key = "";
        document.getElementById("all").checked = false;
      }
    },
    openColumnsOptions() {
      document.getElementById("myDropdown").classList.toggle("show");
    },
    chooseColumn(col) {
      document
        .getElementsByClassName("btn-success")
        .forEach(el => el.classList.remove("btn-success"));
      event.target.classList.remove("btn-transparent");
      event.target.classList.add("btn-success");

      let column = this.fields.find(item => item.key == col);

      column.order = 2;
      column.sortable = true;

      this.fields.forEach(el => {
        let i = 3;
        if (el.key != "Id" && el.key != column.key) {
          el.order = i++;
          el.sortable = false;
        }
      });

      this.fields.sort((a, b) => (a.order > b.order ? 1 : -1));
    },
    UpdatePerPage(value) {
      this.perPage = value;
    }
  }
};
</script>

<style>
.mytable {
  font-size: 14px;
  line-height: 24px;
}

th:first-child {
  width: 30px;
}

.sortBy {
  font-weight: 700;
}

.title {
  padding-bottom: 16px;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #282136;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}

.sortBtns {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.control-panel {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

table {
  background-color: #ffffff;
  border-radius: 4px;
  position: relative;
}

tbody > tr:nth-child(even) > td {
  background-color: #f8f9fa;
}

.table > thead > tr > [aria-sort="none"] {
  background: url("../assets/up.svg") center no-repeat !important;
}

.table > thead > tr > [aria-sort="ascending"] {
  background: url("../assets/up.svg") center no-repeat !important;
}

.table > thead > tr > [aria-sort="descending"] {
  background: url("../assets/up.svg") center no-repeat !important;
}

thead {
  border-bottom: 1px solid #ededed;
  border-top-left-radius: 4px;
}

.custom-select {
  background: #f2f2f2 url("../assets/1.svg") no-repeat right !important;
  border-radius: 2px !important;
  height: 32px !important;
}

.btn-selected-columns {
  background: url("../assets/1.svg") no-repeat right !important;
  width: 155px !important;
}

.btn-prev {
  background: #f2f2f2 url("../assets/prev.svg") no-repeat !important;
  width: 32px !important;
  height: 32px !important;
  background-position: center !important;
}

.btn-next {
  background: #f2f2f2 url("../assets/next.svg") no-repeat !important;
  width: 32px !important;
  height: 32px !important;
  background-position: center !important;
}

.btn {
  border-radius: 2px !important;
  font-size: 14px !important;
  line-height: 24px !important;
}

.btn-outline-secondary {
  border-color: #ced4da !important;
}

.btn-outline-secondary:hover:focus {
  color: #6c757d !important;
  
}

.btn-secondary.disabled, .btn-secondary:disabled {
  border-color: #ced4da !important;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 32px;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  z-index: 1;
  width: 207px;
  height: 243px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 21px;
}

.dropdown-content ul {
  padding-left: 17px;
}

.dropdown label {
  margin-right: 13px;
}

.dropdown-content li {
  list-style: none;
  margin-bottom: 15px;
}

.dropdown-content::-webkit-scrollbar {
  width: 14px;
  height: 18px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  height: 6px;
  border: 5px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  border-radius: 7px;
  background-color: rgba(0, 0, 0, 0.15);
}

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.custom-checkbox + label::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;

  border: 1px solid #adb5bd;
  border-radius: 2px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center center;
}

.custom-checkbox:checked + label::before {
  background-color: #00a11e;
  background-image: url("../assets/shape.svg");
  background-size: contain;
  border: 1px solid #00a11e;
}

.checkbox {
  margin: 0 auto;
}

.deleteMessage {
  display: none;
  position: absolute;
  top: 25%;
  left: 30%;
  width: 254px;
  height: 96px;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 16px;
}

.btnsMessage {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 8px;
}

.show {
  display: block;
}

.btn {
  box-shadow: none !important;
}
</style>
