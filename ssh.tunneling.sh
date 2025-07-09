#!/bin/bash

# SSH tunneling script
ssh -p 2222 -L 5433:localhost:5432 -fN bmutai@41.220.118.182
