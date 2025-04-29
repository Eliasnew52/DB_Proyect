PRODUCT_SCHEMAS = {
    'RULERS': {
        'required': ['graduation', 'transparent'],
        'optional': [],
        'types': {
            'graduation': str,
            'transparent': bool
        }
    },
    'SHARPENERS': {
        'required': ['type', 'integrated_deposit'],
        'optional': [],
        'types': {
            'type': str,
            'integrated_deposit': bool
        }
    },
    'ADHESIVE TAPES': {
        'required': ['transparency'],
        'optional': [],
        'types': {
            'transparency': bool
        }
    },
    'SCISSORS': {
        'required': ['blade_length'],
        'optional': [],
        'types': {
            'blade_length': float
        }
    },
    'CALCULATORS': {
        'required': ['type', 'power_source', 'digits'],
        'optional': ['special_functions'],
        'types': {
            'type': str,
            'power_source': str,
            'digits': int,
            'special_functions': str
        }
    },
    'BACKPACKS': {
        'required': ['number_of_compartments', 'water_resistant', 'capacity'],
        'optional': [],
        'types': {
            'number_of_compartments': int,
            'water_resistant': bool,
            'capacity': str
        }
    },
    'STAPLERS': {
        'required': ['stapling_type', 'staple_capacity', 'stapling_width'],
        'optional': [],
        'types': {
            'stapling_type': str,
            'staple_capacity': int,
            'stapling_width': float
        }
    },
    'COLORED PENCILS': {
        'required': ['pack_size', 'number_of_colors', 'pencil_shape', 'lead_thickness', 'lead_material', 'metallic_plastic_case'],
        'optional': [],
        'types': {
            'pack_size': int,
            'number_of_colors': int,
            'pencil_shape': str,
            'lead_thickness': float,
            'lead_material': str,
            'metallic_plastic_case': bool
        }
    },
    'GRAPHITE PENCILS': {
        'required': ['hardness', 'body_type', 'sharpened_included'],
        'optional': [],
        'types': {
            'hardness': str,
            'body_type': str,
            'sharpened_included': bool
        }
    },
    'PENS': {
        'required': ['ink_type', 'tip_type', 'tip_thickness'],
        'optional': [],
        'types': {
            'ink_type': str,
            'tip_type': str,
            'tip_thickness': float
        }
    },
}