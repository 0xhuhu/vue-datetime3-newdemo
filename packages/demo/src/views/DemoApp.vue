<template>
  <div id="app" class="page">
    <h1><a href="https://github.com/mariomka/vue-datetime">vue-datetime demo</a></h1>

    <h2>Date</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="date" :week-start="1"/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ date }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime v-model=&#x22;date&#x22;/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Datetime</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetime" type="datetime"/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetime }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;datetime&#x22; v-model=&#x22;datetime&#x22;/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Datetime - Fixed Date</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetimeFixedDate" type="datetime" fixed-date/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetimeFixedDate }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;datetime&#x22; v-model=&#x22;datetime&#x22; fixed-date/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Datetime - Fixed Time</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetimeFixedTime" type="datetime" fixed-time/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetimeFixedTime }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;datetime&#x22; v-model=&#x22;datetime&#x22; fixed-time/&#x3E;</code></pre>
      </div>
    </div>

    <h2>12h datetime</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetime12" type="datetime" use12-hour/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetime12 }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;datetime&#x22; v-model=&#x22;datetime12&#x22; use12-hour/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Time</h2>
    <div class="example">
      <div class="example-inputs">
        <date-time v-model="time" type="time"/>
        <div class="values">
          <p>
            <strong>Value:</strong> {{ time }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;time&#x22; v-model=&#x22;time&#x22;/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Macro tokens</h2>
    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetime13" type="datetime" format="yyyy-MM-dd HH:mm:ss"/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetime13 }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime type=&#x22;datetime&#x22; v-model=&#x22;datetime13&#x22; format=&#x22;yyyy-MM-dd HH:mm:ss&#x22;/&#x3E;</code></pre>
      </div>
    </div>

    <h2>Complete demo</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time
          v-model="datetimeEmpty"
          type="datetime"
          placeholder="Select date"
          class="my-wrapper-class"
          input-class="my-input-class"
          value-zone="America/New_York"
          zone="Asia/Shanghai"
          :format="{
            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
          }"
          :phrases="{ ok: 'Continue', cancel: 'Exit' }"
          :hour-step="2"
          :minute-step="15"
          :min-datetime="minDatetime"
          :max-datetime="maxDatetime"
          :week-start="7"
          use12-hour
          auto
        />

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetimeEmpty }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime
  type=&#x22;datetime&#x22;
  v-model=&#x22;datetimeEmpty&#x22;
  input-class=&#x22;my-class&#x22;
  value-zone=&#x22;America/New_York&#x22;
  zone=&#x22;Asia/Shanghai&#x22;
  :format=&#x22;{ year: &#x27;numeric&#x27;, month: &#x27;long&#x27;, day: &#x27;numeric&#x27;, hour: &#x27;numeric&#x27;, minute: &#x27;2-digit&#x27;, timeZoneName: &#x27;short&#x27; }&#x22;
  :phrases=&#x22;{ok: &#x27;Continue&#x27;, cancel: &#x27;Exit&#x27;}&#x22;
  :hour-step=&#x22;2&#x22;
  :minute-step=&#x22;15&#x22;
  :min-datetime=&#x22;minDatetime&#x22;
  :max-datetime=&#x22;maxDatetime&#x22;
  :week-start=&#x22;7&#x22;
  use12-hour
  auto
  /&#x3E;</code></pre>
      </div>
    </div>

    <h2>Theming</h2>

    <div class="example">
      <div class="example-inputs">
        <date-time v-model="datetimeTheming" type="datetime" color="orange"/>

        <div class="values">
          <p>
            <strong>Value:</strong> {{ datetimeTheming }}
          </p>
        </div>
      </div>
      <div class="example-code">
        <pre><code>&#x3C;datetime
  type=&#x22;datetime&#x22;
  v-model=&#x22;datetimeTheming&#x22;
  color=&#x22;orange&#x22;
  /&#x3E;</code></pre>
      </div>
    </div>

    <footer>
      © <a href="https://github.com/mariomka">Mario Juárez</a> -
      <a href="https://github.com/mariomka/vue-datetime">Code on Github</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { DateTime as LuxonDateTime } from 'luxon';
import { ref } from 'vue';

const time = ref('19:06');
const date = ref('2018-10-12T00:00:00.000Z');
const datetime = ref('2018-05-12T17:19:06.151Z');
const datetimeFixedDate = ref('2018-05-12T17:19:06.151Z');
const datetimeFixedTime = ref('2018-05-12T17:19:06.151Z');
const datetime12 = ref('2018-05-12T17:19:06.151Z');
const datetime13 = ref('2018-05-12T17:19:06.151Z');
const datetimeEmpty = ref('');
const minDatetime = ref(LuxonDateTime.local().toISO());
const maxDatetime = ref(LuxonDateTime.local().plus({ days: 3 }).minus({ hours: 4 }).toISO());
const datetimeTheming = ref(LuxonDateTime.local().toISO());
</script>

<script lang="ts">
export default { name: 'DemoApp' };
</script>

<style scoped>

</style>
