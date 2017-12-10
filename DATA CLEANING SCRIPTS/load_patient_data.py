# Load various patient data, combine, preprocess

import os
import numpy as np
import pandas as pd

# Global constants
data_dir = 'data/raw/data_clinical_patient.csv'


def load_per_patient_data():
    """Load main patient info file"""
    dict_file = os.path.join(data_dir, flat_files_dicts_dir, 'PER_PATIENT.xlsx')
    dict_data = pd.read_excel(dict_file)

    fields = {}
    for i, row in dict_data.iterrows():
        type_str = row['vartype']
        if type_str == 'Char':
            type = str
        elif type_str == 'Num':
            type = float
        else:
            raise ValueError('Unknown type {type_str} detected. Fix this.'.format(type_str=type_str))

        fields[row['name']] = type

    data_file = os.path.join(data_dir, flat_files_dir, 'PER_PATIENT.csv')
    data = pd.read_csv(data_file, engine='c', dtype=fields)
    data.set_index('PUBLIC_ID')

    # Fill in NaN cells in str columns with blank strings
    for label, type in fields.items():
        if type == str:
            data[label].fillna('', inplace=True)

    return data, dict_data, fields



if __name__ == '__main__':
    per_patient_data, per_patient_dict, per_patient_fields = load_per_patient_data()

    # Grab all info on 1 patient
    patient = ''
    demographics = per_patient_data.loc[per_patient_data['PUBLIC_ID'] == patient]

    print(demographics)
    print(data)
    print(treatment)
    print(treatment_resp)
    print(survival)

    1
