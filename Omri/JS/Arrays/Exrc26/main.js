function sumInArray(arr, amount) {
  let subsetsummat = Array(arr.length);

  for (let index = 0; index < arr.length; index++) {
      subsetsummat[index] = Array(amount + 1);
      subsetsummat[index][0] = true;
  }

  for (let current_sum = 1; current_sum <= amount; current_sum++) {
      subsetsummat[0][current_sum] = false;
  }

  if (arr[0] <= amount) {
      subsetsummat[0][arr[0]] = true;
  }

  for (let arr_element = 1; arr_element < arr.length; arr_element++) {
      for (let current_sum = 1; current_sum <= amount; current_sum++) {
          subsetsummat[arr_element][current_sum] = subsetsummat[arr_element - 1][current_sum];
          if (!subsetsummat[arr_element][current_sum]) {
              subsetsummat[arr_element][current_sum] = current_sum - arr[arr_element] < 0 ?
                  false : subsetsummat[arr_element - 1][current_sum - arr[arr_element]];
          }
      }
  }

  let subsets = [];

  if (subsetsummat[arr.length - 1][amount]) {

      for (let element_index = arr.length - 1; element_index >= 0; element_index--) {
          let current_sum_reach = amount;
          let next_element_solution_index = element_index;
          let new_subset = [];

          if (subsetsummat[next_element_solution_index][current_sum_reach] &&
              current_sum_reach - arr[next_element_solution_index] >= 0) {

              while (current_sum_reach != 0 && next_element_solution_index > 0) {
                  if (subsetsummat[next_element_solution_index][current_sum_reach] &&
                      current_sum_reach - arr[next_element_solution_index] >= 0) {
                      new_subset.push(arr[next_element_solution_index]);
                      current_sum_reach -= arr[next_element_solution_index];
                  }
                  next_element_solution_index--;
              }

              if (current_sum_reach != 0 && next_element_solution_index == 0) {
                  new_subset.push(arr[next_element_solution_index]);
              }

              if (new_subset.length != 0) {
                  subsets.push(new_subset);
              }
          }
      }
  }

  return subsets;
}

function findSum() {
  let arr_input = document.getElementById("array").value.split(',');
  let arr_translated = [];
  for (let index = 0; index < arr_input.length; index++) {
      arr_translated.push(parseInt(arr_input[index]));
  }

  let results = sumInArray(arr_translated,
      parseInt(document.getElementById("sum").value));

  if (results.length == 0) {
      document.getElementById("result").innerHTML = "Subset Not Found";
  } else {
      document.getElementById("result").innerHTML = JSON.stringify(results);
  }
}