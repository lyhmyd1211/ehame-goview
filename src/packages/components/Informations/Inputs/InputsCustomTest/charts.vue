<template>
	<v-chart  class="charts" :option="option" autoresize />
</template>
<script setup lang="ts" name="history-chart">
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { watch, computed, reactive } from 'vue';

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);




const option = reactive({
	tooltip: {
		trigger: 'axis',
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [
      '01:00:00',
      '02:00:00',
      '03:00:00',
      '04:00:00',
      '05:00:00',
      '06:00:00',
      '07:00:00',
      '08:00:00',
      '09:00:00',
      '10:00:00',
      '11:00:00',
      '12:00:00',
      '13:00:00',
      '14:00:00',
      '15:00:00',
      '16:00:00',
      '17:00:00',
      '18:00:00',
      '19:00:00',
      '20:00:00',
      '21:00:00',
      '22:00:00',
      '23:00:00',
      '24:00:00',
    ],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: '成功',
			type: 'line',
			stack: 'Total',
			data: [100,50,300,400,120,220,50,66,78,45,159,324,458,42,15,64,85,76,80,220,240,330],
		},
	],
});


</script>
<style>
.charts{
  min-height: 300px;
  height: 100%;
  width: 100%;
}
</style>