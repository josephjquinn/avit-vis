export interface MetricsData {
  epoch: number[];
  train_rmse: number[];
  train_nrmse: number[];
  train_l1: number[];
  valid_nrmse: number[];
  valid_rmse: number[];
  valid_l1: number[];
  dens_valid_nrmse: number[];
  dens_valid_rmse: number[];
  dens_valid_l1: number[];
  ptemp_valid_nrmse: number[];
  ptemp_valid_rmse: number[];
  ptemp_valid_l1: number[];
  uwnd_valid_nrmse: number[];
  uwnd_valid_rmse: number[];
  uwnd_valid_l1: number[];
  wwnd_valid_nrmse: number[];
  wwnd_valid_rmse: number[];
  wwnd_valid_l1: number[];
  total_training_time: number;
  final_training_acc: number;
}

export interface NormalizationData {
  train_rmse: number;
  train_nrmse: number;
  train_l1: number;
  valid_nrmse: number;
  valid_rmse: number;
  valid_l1: number;
  dens_valid_nrmse: number;
  dens_valid_rmse: number;
  dens_valid_l1: number;
  ptemp_valid_nrmse: number;
  ptemp_valid_rmse: number;
  ptemp_valid_l1: number;
  uwnd_valid_nrmse: number;
  uwnd_valid_rmse: number;
  uwnd_valid_l1: number;
  wwnd_valid_nrmse: number;
  wwnd_valid_rmse: number;
  wwnd_valid_l1: number;
  train_time: number;
}
