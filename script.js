function factorial(x) {
  if (x === 0) return 1;
  return x * factorial(x - 1);
}

function binomial(n, k, p) {
  let comb = factorial(n) / (factorial(k) * factorial(n - k));
  return comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function poisson(lambda, k) {
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
}

function normal(x, mean, std) {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
}

function exponential(x, lambda) {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
}

let chartInstance;

function drawChart(labels, values, label) {
  const ctx = document.getElementById('distributionChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function computeBinomial() {
  let n = parseInt(document.getElementById('n').value);
  let p = parseFloat(document.getElementById('p').value);
  const labels = [], probs = [];

  for (let k = 0; k <= n; k++) {
    labels.push(k);
    probs.push(binomial(n, k, p));
  }

  drawChart(labels, probs, `Binomial (n=${n}, p=${p})`);
}

function computePoisson() {
  let lambda = parseFloat(document.getElementById('poisson_lambda').value);
  const labels = [], probs = [];

  for (let k = 0; k <= 20; k++) {
    labels.push(k);
    probs.push(poisson(lambda, k));
  }

  drawChart(labels, probs, `Poisson (λ=${lambda})`);
}

function computeNormal() {
  let mean = parseFloat(document.getElementById('normal_mean').value);
  let std = parseFloat(document.getElementById('normal_std').value);
  const labels = [], probs = [];

  for (let x = mean - 4 * std; x <= mean + 4 * std; x += std / 5) {
    labels.push(x.toFixed(2));
    probs.push(normal(x, mean, std));
  }

  drawChart(labels, probs, `Normal (μ=${mean}, σ=${std})`);
}

function computeExponential() {
  let lambda = parseFloat(document.getElementById('exp_lambda').value);
  const labels = [], probs = [];

  for (let x = 0; x <= 10; x += 0.2) {
    labels.push(x.toFixed(1));
    probs.push(exponential(x, lambda));
  }

  drawChart(labels, probs, `Exponential (λ=${lambda})`);
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-buttons button');
  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text("Distribution Chart", 10, 10);
  pdf.addImage(chartInstance.toBase64Image(), 'PNG', 10, 20, 180, 100);
  pdf.save("distribution_chart.pdf");
}
