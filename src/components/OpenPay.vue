<template>
  <v-container>
    <v-card class="mx-auto" elevation="4">
      <v-card-text class="text-center">
        <v-btn
          class="text-black"
          color="#ffc000"
          prepend-icon="mdi-music"
          @click="goToCreateSong"
        >
          Crear canción
        </v-btn>
      </v-card-text>
    </v-card>

    <v-form
      ref="form"
      v-model="valid"
      class="pt-4"
      lazy-validation
      @submit.prevent="pay"
    >
      <v-card>
        <v-card-title>Paquetes LIRICALL</v-card-title>
        <v-divider thickness="1" />
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="packageSelected"
                item-title="package"
                item-value="_id"
                :items="packages"
                label="Selecciona un paquete"
                required
                :rules="[(v) => !!v || 'Seleccione paquete']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="amount"
                label="Cantidad a pagar (MXN)"
                readonly
                :rules="[(v) => !!v || 'Seleccione paquete']"
                type="text"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Datos del cliente</v-card-title>
        <v-divider thickness="1" />
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name"
                autocomplete="off"
                label="Nombres"
                required
                :rules="[(v) => !!v || 'El nombre del cliente es requerido']"
                type="text"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="last_name"
                autocomplete="off"
                label="Apellidos"
                name="last_name"
                required
                :rules="[(v) => !!v || 'El apellido del cliente es requerido']"
                type="text"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="phone_number"
                autocomplete="off"
                label="Teléfono"
                required
                :rules="[(v) => !!v || 'El teléfono del cliente es requerido']"
                type="text"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email"
                autocomplete="off"
                label="Email"
                required
                :rules="emailRules"
                type="email"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>Tarjeta de crédito o débito</v-card-title>
        <v-divider thickness="1" />
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div>
                <span type="info" variant="outlined">
                  Tarjetas de crédito
                </span>
                <v-img
                  alt="Tarjetas de Crédito"
                  class="mt-4"
                  src="/src/assets/openpay/cards1.png"
                  width="209px"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div>
                <span type="info" variant="outlined"> Tarjetas de débito </span>
                <v-img
                  alt="Tarjetas de Débito"
                  class="mt-4"
                  src="/src/assets/openpay/cards2.png"
                  width="540px"
                />
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="name_titular"
                autocomplete="off"
                label="Nombre del titular"
                required
                :rules="[(v) => !!v || 'El nombre del titular es requerido']"
                type="text"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="number_card"
                autocomplete="off"
                label="Número de tarjeta"
                :mask="mask_credit_card"
                name="number_card"
                required
                :rules="[(v) => !!v || 'El número de tarjeta es requerido']"
                type="text"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <span
                    type="info"
                    variant="outlined"
                  >Fecha de expiración</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="7">
                  <v-select
                    v-model="month_expiration"
                    item-title="text"
                    item-value="value"
                    :items="items_months"
                    label="MES"
                    required
                    :rules="[(v) => !!v || 'El mes de expiración es requerido']"
                  />
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="year_expiration"
                    label="AÑO"
                    required
                    :rules="rules_year"
                    type="number"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-label
                    for="cvc"
                    type="info"
                    variant="outlined"
                  >Código de seguridad (CVV)</v-label>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5">
                  <v-text-field
                    id="cvc"
                    v-model="cvv2"
                    autocomplete="off"
                    label="CVC"
                    name="cvc"
                    required
                    :rules="[rules_cvc.required, rules_cvc.min, rules_cvc.max]"
                    type="number"
                  />
                </v-col>
                <v-col class="" cols="7">
                  <v-img
                    alt="CVV"
                    class="mt-4"
                    src="/src/assets/openpay/cvv.png"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <span class="small" type="info" variant="outlined">
                Transacciones realizadas vía:
              </span>
              <v-img
                alt="Opepay image"
                height="40px"
                src="/src/assets/openpay/openpay.png"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-alert type="info" variant="outlined">
                <span class="small" type="info" variant="outlined">
                  Tus pagos se realizan de forma segura con encriptación de 256
                  bits
                </span>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider thickness="1" />
        <v-card-actions class="justify-end">
          <v-btn
            class="black-text"
            :color="colorButton"
            :disabled="!valid||processing"
            prepend-icon="mdi-credit-card"
            type="submit"
            variant="tonal"
          >
            {{ mesageButton }}
            <v-icon>{{ iconButton }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <!-- Success Dialog -->
    <v-dialog
      v-model="successDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>¡Venta registrada exitósamente!</v-card-title>
        <v-card-text>
          <p><strong>Descripción:</strong> {{ description }}</p>
          <p><strong>Precio:</strong> {{ amount }}</p>
          <p><strong>Autorización:</strong> {{ charge.authorization }}</p>
          <p><strong>ID:</strong> {{ charge.id }}</p>
          <p><strong>Cliente:</strong> {{ sale.customer }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary-color"
            @click="closeSuccessDialog"
          >Enterado</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2" icon="mdi-alert-circle" />
          Ha ocurrido un error inesperado
        </v-card-title>
        <v-card-text class="pa-4">
          <p>{{ errorMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary-color"
            @click="closeErrorDialog"
          >Enterado</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApi } from '@/composables/useApi'

  const router = useRouter()

  const openpay_id = import.meta.env.VITE_OPENPAY_ID
  const openpay_key = import.meta.env.VITE_OPENPAY_PUBLIC_KEY
  const openpay_sandbox_mode = import.meta.env.VITE_OPENPAY_SANDBOX_MODE === 'true'
  const apiHost = import.meta.env.VITE_API_BASE_URL

  const { api } = useApi()

  const valid = ref(true)
  const processing = ref(false)

  const packageSelected = ref('')
  const description = ref('')
  const amount = ref(null)

  // Response from Openpay charge
  const charge = ref({})
  const sale = ref({})

  const name = ref('Steel Ed')
  const last_name = ref('Vazquez George')
  const email = ref('george.vazquez@example.com')
  const phone_number = ref('5555555555')

  const number_card = ref('4111111111111111')
  const mask_credit_card = ref('credit-card')
  const name_titular = ref('STEEL ED VAZQUEZ GEORGE')
  const month_expiration = ref('12')
  const year_expiration = ref('32')
  const cvv2 = ref('123')

  const token_id = ref('')
  const deviceSessionId = ref('')
  const mesageButton = ref('Procesar pago')
  const iconButton = ref('attach_money')
  const colorButton = ref('yellow')

  const packages = ref([])

  const successDialog = ref(false)
  const errorDialog = ref(false)
  const errorMessage = ref('')

  const rules_cvc = {
    required: v => !!v || 'El cvc es requerido',
    min: v => (v && v.length >= 3) || 'Mínimo 3 números',
    max: v => (v && v.length <= 4) || 'Máximo 4 números',
  }

  const items_months = [
    { text: '01 - Enero', value: '01' },
    { text: '02 - Febrero', value: '02' },
    { text: '03 - Marzo', value: '03' },
    { text: '04 - Abril', value: '04' },
    { text: '05 - Mayo', value: '05' },
    { text: '06 - Junio', value: '06' },
    { text: '07 - Julio', value: '07' },
    { text: '08 - Agosto', value: '08' },
    { text: '09 - Septiembre', value: '09' },
    { text: '10 - Octubre', value: '10' },
    { text: '11 - Noviembre', value: '11' },
    { text: '12 - Diciembre', value: '12' },
  ]

  const rules_year = [
    v => !!v || 'El año de expiración es requerido',
    v => (v && v.length >= 2) || 'Mínimo 2 números',
    v => (v && v.length <= 2) || 'Máximo 2 números',
  ]

  const emailRules = [
    v => !!v || 'El correo electrónico es requerido',
    v => /.+@.+/.test(v) || 'El correo electrónico debe de ser valido',
  ]

  // Update amount when description changes
  watch(packageSelected, newVal => {
    if (!newVal) {
      description.value = ''
      amount.value = 0
      return
    }
    const selected = packages.value.find(pkg => pkg._id === newVal)

    description.value = selected ? selected.package : ''
    amount.value = selected ? selected.price : 0
  })

  function goToCreateSong () {
    router.push({ path: '/' })
  }

  async function fetchPackages () {
    try {
      const response = await api.get(`${apiHost}/api/packages`)
      packages.value = response.data
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  onMounted(() => {
    // sistema anti-fraude
    OpenPay.setId(openpay_id)
    OpenPay.setApiKey(openpay_key)
    OpenPay.setSandboxMode(openpay_sandbox_mode)

    deviceSessionId.value = OpenPay.deviceData.setup()

    fetchPackages()
  })

  // Close dialogs
  function closeSuccessDialog () {
    successDialog.value = false
    mesageButton.value = 'Procesar Pago'
    processing.value = false
  }

  function closeErrorDialog () {
    errorDialog.value = false
    errorMessage.value = ''
    processing.value = false
  }

  async function pay () {
    if (!valid.value) return

    processing.value = true

    mesageButton.value = 'Procesando...'
    iconButton.value = 'autorenew'
    colorButton.value = 'grey'

    // generate token_id para realizar el cargo
    const dataPayment = {
      holder_name: name_titular.value,
      card_number: number_card.value,
      cvv2: cvv2.value,
      expiration_month: month_expiration.value,
      expiration_year: year_expiration.value,
    }

    OpenPay.token.create(
      dataPayment,
      async response => {
        token_id.value = response.data.id

        const customer = {
          name: name.value,
          last_name: last_name.value,
          email: email.value,
          phone_number: phone_number.value,
        }

        const chargeData = {
          method: 'card',
          source_id: token_id.value,
          amount: Number.parseFloat(amount.value),
          description: description.value,
          device_session_id: deviceSessionId.value,
        }

        const payload = {
          chargeData,
          customer,
        }

        // payment in OpenPay
        try {
          // POST sale to /api/sales
          const response = await api.post(`${apiHost}/api/sales`, payload)
          charge.value = response.data.charge
          sale.value = response.data.sale

          successDialog.value = true

          mesageButton.value = 'Pagado'
          iconButton.value = 'check_circle'
          colorButton.value = 'green'

          processing.value = false
        } catch (error) {
          mesageButton.value = 'Procesar pago'
          iconButton.value = 'attach_money'
          colorButton.value = 'yellow'

          processing.value = false

          errorMessage.value = error
          errorDialog.value = true
        }
      },
      error => {
        errorMessage.value = error
        processing.value = false
        errorDialog.value = true
      },
    )
  }
</script>
<style scoped>
.v-card {
  max-width: 700px;
  margin: auto;
  margin-top: 20px;
}
.small {
  font-size: 12px;
}
</style>
