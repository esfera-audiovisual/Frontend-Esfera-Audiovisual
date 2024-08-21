<script setup>
import { ref } from 'vue';

const stringOptions = [
    'Santander, Colombia',
    'Bucaramanga, Santander',
    'Cucuta, Norte de Santander',
    'Barichara, Santander',
    'San Gil, Santander',
];

const options = ref(stringOptions);
const date = ref('');
const model = ref('');

const filterFn = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase();
        options.value = stringOptions.filter((v) =>
            v.toLowerCase().indexOf(needle) > -1
        );
    });
};
</script>

<template>
    <div>
        <q-layout view="hHh lpR fFf">
            <q-header elevated>
                <q-toolbar>
                    <!-- Airbnb Logo -->
                    <q-btn flat round icon="public" />
                    <q-toolbar-title>
                        <q-icon name="" color="red" size="30px" />
                        <h6 class="color-primary">Esfera Audiovisual</h6>
                    </q-toolbar-title>

                    <div class="q-pa-md">
                        <div class="q-gutter-md row">
                            <q-select filled v-model="model" use-input hide-selected fill-input input-debounce="0"
                                :options="options" @filter="filterFn" placeholder="¿Dónde?"
                                style="width: 250px; padding-bottom: 32px; background-color: white;">
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                    </div>

                    <div>
                        <q-input v-model="date" filled type="date" placeholder="Cuando" style="background-color: white;" />
                    </div>

                    <!-- Right Side Links -->
                    <q-space />
                    <q-btn flat label="Pon tu salon" />
                    <q-btn flat round icon="account_circle" />
                </q-toolbar>
            </q-header>

            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </div>
</template>

<style scoped>
.q-input {
    max-width: 200px;
}

.q-btn {
    background-color: rgb(112, 27, 240);
    color: white;
}

.q-input__inner {
    padding-left: 10px;
}

.q-my-input {
    width: 300px;
}

.q-date-custom {
    --q-color-primary: #42a5f5;
    /* Color personalizado */
}

.q-my-input .q-field__control {
    font-size: 16px;
    /* Cambiar tamaño de fuente */
}

.q-my-input .q-field__label {
    font-weight: bold;
    /* Cambiar estilo de la etiqueta */
}
</style>